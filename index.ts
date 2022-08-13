import fs from 'fs'
import { resolve } from 'path'
import shell from 'shelljs'
import { Mp4ToImageTo4KToMp4 } from './src/utils'
import { prompt } from './src/utils/prompt'
import type { IAnswers } from './src/types/type.d'

/** 视频输入文件夹 E:/input */
const input = resolve('./input')

/** 视频输出文件夹 E:/output */
const output = resolve('./output')

/** 临时图片文件存放文件夹 E:/img_temp */
const img_temp = resolve('./img_temp')

/** 优化后的图片输出文件夹 E:/out */
const img_out = resolve('./img_out')

/** 需要创建的文件夹 */
const fileList = [img_temp, img_out, output]

/** 循环创建基础文件夹 */
fileList.forEach((file) => {
    /** 如果文件夹不存在则创建一个 */
    if (!fs.existsSync(file)) {
        fs.mkdirSync(file)
    }
})

/** output已经有的视频 */
const complieteList = fs.readdirSync(output)

/** 读取输入文件夹 */
fs.readdir(
    input,
    /**
     * @param err    失败的信息
     * @param files  视频的集合
     */
    async (err, files) => {
        if (err) return console.log(err)
        const options = await prompt()
        // const options: IAnswers = { videoType: '动漫视频' }
        files.forEach(
            /** @param file 每个视频的名字 伪恋.mp4 */
            (file) => {
                /** 如果这个视频已经有了，则不用再生成了 */
                if (!complieteList.includes(file)) {
                    /** 截取视频的文件名 伪恋 */
                    const filename = file.slice(0, -4)

                    /** 视频所在的绝对路径 E:/input/伪恋.mp4 */
                    const inputFileFullPath = resolve(input + `/${file}`)

                    /** 视频所在的绝对路径 E:/output/伪恋.mp4 */
                    const outputFileFullPath = resolve(output + `/${file}`)

                    /** 作品的临时图片文件夹 E:/img_temp/伪恋 */
                    const img_temp_floder = resolve(img_temp + `/${filename}_temp`)

                    /** 作品图片的优化文件夹 E:/img_out/伪恋 */
                    const img_out_floder = resolve(img_out + `/${filename}_out`)

                    /** 需要创建的文件夹 */
                    const fileList = [img_temp_floder, img_out_floder]

                    /** 循环创建图片的临时文件夹 */
                    fileList.forEach((file) => {
                        /** 如果文件夹不存在则创建一个 */
                        if (!fs.existsSync(file)) {
                            fs.mkdirSync(file)
                        }
                    })
                    /** 视频的帧数 */
                    let fps = '29.97'

                    shell.exec(
                        `ffmpeg -i "${inputFileFullPath}"`,
                        /**
                         *
                         * @param _code    返回的状态码，`0`为成功
                         * @param _s
                         * @param message  控制台输出的信息
                         */
                        (_code, _s, message) => {
                            /** 匹配fps */
                            const result = message.match(/\w{2}\.?\w{0,2}(?= fps)/)
                            fps = (result && result[0]) || '29.97'
                        }
                    )

                    /** 开始转视频 */
                    Mp4ToImageTo4KToMp4(
                        img_temp_floder,
                        input,
                        file,
                        img_out_floder,
                        fps,
                        inputFileFullPath,
                        outputFileFullPath,
                        options
                    )
                }
            }
        )
    }
)
