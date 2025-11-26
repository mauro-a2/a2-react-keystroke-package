import {
    IMobileKeystrokeCollection,
    IKeystrokeCollection,
    IBaseKeystrokeCollection
} from "@area2-ai/a2-node-keystroke-package";

export interface A2CapturePayload
    extends IBaseKeystrokeCollection,
    Partial<Omit<IKeystrokeCollection, keyof IBaseKeystrokeCollection>>,
    Partial<Omit<IMobileKeystrokeCollection, keyof IBaseKeystrokeCollection>> { }
