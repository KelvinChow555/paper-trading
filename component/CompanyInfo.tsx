"use client"
import Image from "next/image";
import styled from "styled-components";
import { CompanyProps } from "@/types";
import { Gray, Grid, Label, Value } from "./Styles";

const Top = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const Logo = styled(Image)`
    height: 48px;
    width: auto;
`;

export default function CompanyInfo({ company }: { company: CompanyProps }) {
    let marketCap = "N/A";
    if (company.marketCap) {
        marketCap = `$${(company.marketCap / 1e9).toFixed(1)}B`;
    }
    const facts = [
        { label: "Market cap", value: marketCap },
        { label: "Exchange", value: company.exchange },
        { label: "Employees", value: company.employees?.toLocaleString("en-US") },
        { label: "Listed since", value: company.listDate },
    ];
    return (
        <div>
            <Top>
                {company.logo && <Logo src={company.logo} alt="" width={256} height={96} unoptimized />}
                <div>
                    <h1>{company.name}</h1>
                    <Gray>{company.ticker}</Gray>
                </div>
            </Top>
            <p>{company.description}</p>
            <Grid>
                {facts.map((fact) => (
                    <div key={fact.label}>
                        <Label>{fact.label}</Label>
                        <Value>{fact.value ?? "N/A"}</Value>
                    </div>
                ))}
            </Grid>
            {company.homepage && (
                <a href={company.homepage} target="_blank" rel="noreferrer">
                    Visit company website
                </a>
            )}
        </div>
    );
}
