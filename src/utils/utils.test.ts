import {describe, test, expect} from "vitest"

import {getFilter} from "./"

describe("getFilter", () => {
    test("returns correct CSS filter style", () => {
        const style = getFilter({grayscale: 50, sepia: 20, brightness: 150, contrast: 120, blur: 5})
        expect(style).toEqual({
            filter: "grayscale(50%) sepia(20%) brightness(150%) contrast(120%) blur(5px)"
        })
    })

    test("should return default values when no parameters are provided", () => {
        const style = getFilter({})
        expect(style).toEqual({
            filter: "grayscale(0%) sepia(0%) brightness(100%) contrast(100%) blur(0px)"
        })
    })
})