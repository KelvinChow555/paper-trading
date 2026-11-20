"use client";
import styled from "styled-components";

export const Main = styled.main`
    max-width: 900px;
    margin: 0 auto;
    padding: 32px 16px;
`;

export const Card = styled.section`
    margin-top: 16px;
    padding: 24px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: white;
    overflow-x: auto;
`;

export const Gray = styled.p`
    color: #6b7280;
`;

export const Grid = styled.dl`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 16px;
`;

export const Label = styled.dt`
    font-size: 14px;
    color: #6b7280;
`;

export const Value = styled.dd`
    margin: 0;
    font-size: 20px;
    font-weight: bold;
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const Input = styled.input`
    padding: 8px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 16px;
`;

export const Button = styled.button`
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    background: #2563eb;
    color: white;
    font-size: 16px;
    cursor: pointer;

    &:disabled {
        opacity: 0.5;
        cursor: default;
    }
`;

export const LightButton = styled(Button)`
    background: white;
    color: #111827;
    border: 1px solid #d1d5db;
`;

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;

    th, td {
        padding: 8px;
        border-bottom: 1px solid #e5e7eb;
        text-align: left;
    }
    th {
        color: #6b7280;
        font-weight: normal;
    }
`;

export const ErrorText = styled.p`
    margin: 0;
    color: #b91c1c;
`;

export const SuccessText = styled.p`
    margin: 0;
    color: #15803d;
`;
