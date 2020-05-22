/// <reference types="node" />
import { Transform } from 'stream';
export { BinaryReaderState, SectionCode } from './WasmParser.js';
export declare class BinaryReaderTransform extends Transform {
    private _buffer;
    private _bufferSize;
    private _parser;
    constructor();
    _transform(chunk: any, encoding: BufferEncoding, callback: Function): void;
    _flush(callback: Function): void;
}
