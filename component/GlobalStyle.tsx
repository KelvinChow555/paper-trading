"use client";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
    }
    body {
        margin: 0;
        background: #f3f4f6;
        color: #111827;
        font-family: Arial, Helvetica, sans-serif;
    }
    a {
        color: #2563eb;
    }
`;

export default GlobalStyle;
