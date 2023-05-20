import { IMainProject } from "../model/baseModel"

export type IStoragedFile = {
    dirname: string
    basename: string
    content: IMainProject
}