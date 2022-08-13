import inquirer from 'inquirer'
import type { IAnswers, IQuestion } from '../types/type.d'

/**
 * 交互式选择视频类型
 * @returns 返回视频类型 `{ videoType:'动漫视频' | '普通视频' }`
 */
export async function prompt() {
    const answer: IAnswers = await inquirer.prompt([
        <IQuestion>{
            type: 'list',
            name: 'videoType',
            message: '请选择视频的类型',
            choices: ['动漫视频', '普通视频'],
        },
    ])
    return answer
}
