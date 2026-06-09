#!/usr/bin/env swift
// Converts MP4 (white-ish background) to HEVC-with-Alpha MOV for Safari.
// Uses AVVideoCodecType.hevcWithAlpha — the only encoder that produces the
// dual-stream format Safari's <video> element can actually play with transparency.
//
// Usage: swift make-hevc-alpha.swift <input.mp4> <output.mov>

import AVFoundation
import CoreVideo
import Foundation

func keyPixels(_ pixelBuffer: CVPixelBuffer) {
    let width  = CVPixelBufferGetWidth(pixelBuffer)
    let height = CVPixelBufferGetHeight(pixelBuffer)
    let bpr    = CVPixelBufferGetBytesPerRow(pixelBuffer)
    let base   = CVPixelBufferGetBaseAddress(pixelBuffer)!.assumingMemoryBound(to: UInt8.self)

    // Sample 32 pixels from each corner to estimate background luminance.
    // Corners are reliably background (characters are centred).
    var bgSum = 0.0
    var bgCount = 0
    let sampleN = 32
    for j in 0..<sampleN {
        // top-left
        var off = j * 4
        bgSum += (Double(base[off]) + Double(base[off+1]) + Double(base[off+2])) / 3.0
        bgCount += 1
        // top-right
        off = (width - 1 - j) * 4
        bgSum += (Double(base[off]) + Double(base[off+1]) + Double(base[off+2])) / 3.0
        bgCount += 1
        // bottom-left
        off = (height - 1) * bpr + j * 4
        bgSum += (Double(base[off]) + Double(base[off+1]) + Double(base[off+2])) / 3.0
        bgCount += 1
        // bottom-right
        off = (height - 1) * bpr + (width - 1 - j) * 4
        bgSum += (Double(base[off]) + Double(base[off+1]) + Double(base[off+2])) / 3.0
        bgCount += 1
    }
    let bgLum = bgSum / Double(bgCount)

    // Threshold: only key pixels that are:
    //   (a) near-achromatic (saturation < 20 — background is grey/white, characters have colour)
    //   (b) brighter than bgLum - 12 (within the background luma band)
    // Blend zone: 25 levels below bgLum → smooth edge
    let loThresh = bgLum - 25.0
    let hiThresh = bgLum + 5.0

    for y in 0..<height {
        for x in 0..<width {
            let off = y * bpr + x * 4
            let b = Double(base[off])
            let g = Double(base[off+1])
            let r = Double(base[off+2])
            let lum = (r + g + b) / 3.0
            let sat = max(r, max(g, b)) - min(r, min(g, b))

            if lum >= loThresh && sat < 20.0 {
                // How deep into the keying zone: 0 at loThresh → 255 at hiThresh
                let t = max(0.0, min(1.0, (lum - loThresh) / (hiThresh - loThresh)))
                base[off+3] = UInt8(255.0 - t * 255.0)  // fully transparent at hiThresh
            } else {
                base[off+3] = 255
            }
        }
    }
}

func process(inputPath: String, outputPath: String) {
    let inputURL  = URL(fileURLWithPath: inputPath)
    let outputURL = URL(fileURLWithPath: outputPath)

    let asset = AVAsset(url: inputURL)
    guard let track = asset.tracks(withMediaType: .video).first else {
        fputs("No video track: \(inputPath)\n", stderr); exit(1)
    }

    try? FileManager.default.removeItem(at: outputURL)

    guard let reader = try? AVAssetReader(asset: asset),
          let writer = try? AVAssetWriter(outputURL: outputURL, fileType: .mov)
    else { fputs("Cannot create reader/writer\n", stderr); exit(1) }

    let readerOut = AVAssetReaderTrackOutput(track: track, outputSettings: [
        kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA
    ])
    reader.add(readerOut)

    let sz = track.naturalSize
    let writerIn = AVAssetWriterInput(mediaType: .video, outputSettings: [
        AVVideoCodecKey:  AVVideoCodecType.hevcWithAlpha,
        AVVideoWidthKey:  Int(sz.width),
        AVVideoHeightKey: Int(sz.height),
        AVVideoCompressionPropertiesKey: [
            AVVideoQualityKey: 0.80
        ]
    ])
    writerIn.expectsMediaDataInRealTime = false
    let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: writerIn,
                                                       sourcePixelBufferAttributes: nil)
    writer.add(writerIn)

    reader.startReading()
    writer.startWriting()
    writer.startSession(atSourceTime: .zero)

    var n = 0
    while let buf = readerOut.copyNextSampleBuffer() {
        guard let pb = CMSampleBufferGetImageBuffer(buf) else { continue }
        let pts = CMSampleBufferGetPresentationTimeStamp(buf)
        CVPixelBufferLockBaseAddress(pb, [])
        keyPixels(pb)
        CVPixelBufferUnlockBaseAddress(pb, [])
        while !writerIn.isReadyForMoreMediaData { Thread.sleep(forTimeInterval: 0.005) }
        adaptor.append(pb, withPresentationTime: pts)
        n += 1
    }

    writerIn.markAsFinished()
    let sem = DispatchSemaphore(value: 0)
    writer.finishWriting { sem.signal() }
    sem.wait()

    if writer.status == .completed {
        fputs("[\(n) frames] \(outputPath)\n", stderr)
    } else {
        fputs("Error: \(writer.error?.localizedDescription ?? "unknown")\n", stderr)
        exit(1)
    }
}

let args = CommandLine.arguments
guard args.count == 3 else {
    fputs("Usage: make-hevc-alpha <input.mp4> <output.mov>\n", stderr); exit(1)
}
process(inputPath: args[1], outputPath: args[2])
