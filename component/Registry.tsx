"use client";
import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

// Lets the server send the styled-components CSS with the page, so it doesn't flash unstyled.
export default function Registry({ children }: { children: React.ReactNode }) {
    const [sheet] = useState(() => new ServerStyleSheet());
    useServerInsertedHTML(() => {
        const styles = sheet.getStyleElement();
        sheet.instance.clearTag();
        return <>{styles}</>;
    });
    if (typeof window !== "undefined") {
        return <>{children}</>;
    }
    return <StyleSheetManager sheet={sheet.instance}>{children}</StyleSheetManager>;
}
