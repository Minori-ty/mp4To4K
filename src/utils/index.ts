import shell from 'shelljs'
import fs from 'fs'
import type { IAnswers, IModel } from '../types/type.d'

/**
 * 视频转图片转4K转视频
 * @param img_temp_floder     作品的临时图片文件夹 `E:/img_temp/伪恋`
 * @param input               视频输入文件夹
 * @param file                每个视频的名字 example.mp4
 * @param img_out_floder      作品图片的优化文件夹 `E:/img_out/伪恋`
 * @param fps                 图片帧数
 * @param inputFileFullPath   视频所在的绝对路径 `E:/input/伪恋.mp4`
 * @param outputFileFullPath  视频所在的绝对路径 `E:/output/伪恋.mp4`
 */
export function Mp4ToImageTo4KToMp4(
    img_temp_floder: string,
    input: string,
    file: string,
    img_out_floder: string,
    fps: string,
    inputFileFullPath: string,
    outputFileFullPath: string,
    options: IAnswers
) {
    /** 如果视频已经转图片了，则不用再转了 */
    if (fs.readdirSync(img_temp_floder).length === 0) {
        shell.exec(
            `ffmpeg -i "${input}/${file}" -qscale:v 1 -qmin 1 -qmax 1 -vsync 0 "${img_temp_floder}/frame%08d.png"`,
            (code) => {
                if (code === 0) {
                    ImageTo4kToMp4(img_out_floder, img_temp_floder, fps, inputFileFullPath, outputFileFullPath, options)
                }
            }
        )
    } else {
        ImageTo4kToMp4(img_out_floder, img_temp_floder, fps, inputFileFullPath, outputFileFullPath, options)
    }
}

/**
 * 图片转4K转视频
 * @param img_out_floder      作品图片的优化文件夹 `E:/img_out/伪恋`
 * @param img_temp_floder     作品的临时图片文件夹 `E:/img_temp/伪恋`
 * @param fps                 图片帧数
 * @param inputFileFullPath   视频所在的绝对路径 `E:/input/伪恋.mp4`
 * @param outputFileFullPath  视频所在的绝对路径 `E:/output/伪恋.mp4`
 */
export function ImageTo4kToMp4(
    img_out_floder: string,
    img_temp_floder: string,
    fps: string,
    inputFileFullPath: string,
    outputFileFullPath: string,
    options: IAnswers
) {
    /** 如果图片已经优化好了，不用再优化了 */
    if (fs.readdirSync(img_out_floder).length === 0) {
        optimizeImage(img_temp_floder, img_out_floder, fps, inputFileFullPath, outputFileFullPath, options, ImageToMp4)
    } else {
        ImageToMp4(fps, img_out_floder, inputFileFullPath, outputFileFullPath)
    }
}

/**
 * 图片转4K转视频
 * @param img_temp_floder     作品的临时图片文件夹 `E:/img_temp/伪恋`
 * @param img_out_floder      作品图片的优化文件夹 `E:/img_out/伪恋`
 * @param fps                 图片帧数
 * @param inputFileFullPath   视频所在的绝对路径 `E:/input/伪恋.mp4`
 * @param outputFileFullPath  视频所在的绝对路径 `E:/output/伪恋.mp4`
 * @param options             视频的类型 `normal | anime`
 * @param callback            完成后调用函数
 */
export function optimizeImage(
    img_temp_floder: string,
    img_out_floder: string,
    fps: string,
    inputFileFullPath: string,
    outputFileFullPath: string,
    options: IAnswers,
    callback: typeof ImageToMp4
) {
    console.log('开始图片转4K')

    /** 跳转转换模型 */
    let model: IModel = 'realesr-animevideov3'

    /** 如果选择的是普通图片，则用默认模型 */
    if (options.videoType === '普通视频') model = 'realesrgan-x4plus'

    shell.exec(
        `realesrgan-ncnn-vulkan.exe -i "${img_temp_floder}" -o "${img_out_floder}" -n ${model} -s 2 -f jpg`,
        (code) => {
            if (code === 0) callback(fps, img_out_floder, inputFileFullPath, outputFileFullPath)
        }
    )
}

/**
 * 4K转视频
 * @param fps                 图片帧数
 * @param img_out_floder      作品图片的优化文件夹 `E:/img_out/伪恋`
 * @param inputFileFullPath   视频所在的绝对路径 `E:/input/伪恋.mp4`
 * @param outputFileFullPath  视频所在的绝对路径 `E:/output/伪恋.mp4`
 */
export function ImageToMp4(fps: string, img_out_floder: string, inputFileFullPath: string, outputFileFullPath: string) {
    console.log('开始图片转视频')

    shell.exec(
        `ffmpeg -r ${fps} -i "${img_out_floder}/frame%08d.jpg" -i "${inputFileFullPath}" -map 0:v:0 -map 1:a:0 -c:a copy -c:v hevc_nvenc -r ${fps} -pix_fmt yuv420p "${outputFileFullPath}"`
    )
}
