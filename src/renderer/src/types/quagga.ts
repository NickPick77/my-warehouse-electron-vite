interface StartInfo {
    error: number;
    code: number;
    start: number;
    end: number;
}

interface DecodedCode {
    code: number;
    start: number;
    end: number;
    error?: number;
}

interface CodeResult {
    code: string;
    start: number;
    end: number;
    codeset: string;
    startInfo: StartInfo;
    decodedCodes: DecodedCode[];
    direction: number;
    format: string;
}

interface LinePoint {
    x: number;
    y: number;
}

interface Line {
    [index: number]: LinePoint;
}

interface ImagePattern {
    [index: number]: number;
}

interface BoxPoint {
    [index: number]: number;
}

interface Box {
    [index: number]: BoxPoint;
}

interface Boxes {
    [index: number]: Box[];
}

export interface QuaggaImageObject {
    codeResult: CodeResult;
    line: Line;
    angle: number;
    pattern: ImagePattern;
    box: Box;
    boxes: Boxes;
}