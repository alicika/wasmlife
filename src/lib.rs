mod utils;

use wasm_bindgen::prelude::*;
use std::fmt::Display;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Cell {
    Dead = 0,
    Alive = 1,
}

#[wasm_bindgen]
pub struct Universe {
    width: u32,
    height: u32,
    cells: Vec<Cell>,
}

#[wasm_bindgen]
pub fn index(row, column, universe) {
    row * (width) + column
}


#[derive(Debug)]
#[allow(unused)]
impl<T> Temp<T> for Universe
{
    pub fn new() {
        let (width, height) = (0_u32, 0_u32);
        let cells = Vec!(Cell { Dead });
    }
}