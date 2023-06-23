import { Box, Grid, GridItem, Text, useColorMode } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";

import { ArrowLeft } from "@/assets/svgs";
import TokenIcon from "@/components/TokenIcon";
import Chart from "@/components/chart";
import PageWrapper from "@/components/page-wrapper";
import fakeChartData from "@/data/fakeData.json";
import { formatDate } from "@/utils/date.utils";
import { mode } from "@/utils/theme";

interface GraphDataPoint {
  date: string;
  tvl: number | string;
  apy: number | string;
}
type graphSections = "TVL" | "APY";

const graphData = fakeChartData.data.map<GraphDataPoint>((item) => ({
  date: formatDate(new Date(item.timestamp)),
  tvl: item.tvlUsd,
  apy: item.apy,
}));

export default function LendDetails() {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const [graphSection] = useState<graphSections>("APY");

  const token = (router.query.token || "") as string;

  return (
    <>
      <PageWrapper>
        <Grid
          gridTemplateColumns={"20% 1fr"}
          templateAreas={{
            base: `"header header"
                    "sideLeft sideRight"`,
            md: `"header header"
                    "sideLeft sideRight"`,
            sm: `"header header " 
                    "sideLeft"
                    "sideRight"`,
          }}
          templateRows={{
            base: "1fr",
            lg: "1fr auto",
          }}
          templateColumns={{
            base: "1fr",
            md: "1fr 1fr",
          }}
          gap={{
            base: "12px",
            md: "20px",
            lg: "24px",
          }}
          height="full"
          width="full"
        >
          <GridItem
            area="header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Link href="/lend" style={{ cursor: "pointer" }}>
              <ArrowLeft width={32} height={32} />
            </Link>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span>
                <TokenIcon name={token} width={38} height={38} />
              </span>
              <Text fontWeight="light" fontSize="3xl">
                {token.toUpperCase()} Vault Details
              </Text>
            </div>
            <span></span>
          </GridItem>

          <GridItem>
            <Box width="100%">
              {[
                {
                  title: "Borrowable Balance",
                  value: `0 ${token}`,
                },
                {
                  title: "Utilisation Rate",
                  value: "0.00%",
                },
                {
                  title: "Revenues",
                  value: `0 ${token}`,
                },
                {
                  title: "Insurance Reserve",
                  value: `0 ${token}`,
                },
              ].map((item, index) => {
                return (
                  <Fragment key={index}>
                    <Box
                      mt={5}
                      bg={mode(colorMode, "primary.100", "primary.100.dark")}
                      style={{
                        alignItems: "center",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: "30px 10px",
                        width: "100%",
                      }}
                    >
                      <Text fontWeight="bold">{item.title}</Text>
                      <Text mt="20px" fontWeight="medium">
                        {item.value}
                      </Text>
                    </Box>
                  </Fragment>
                );
              })}
            </Box>
            <Box
              style={{ width: "80%" }}
              className="p-5 rounded-xl bg-primary-100"
            >
              <div className="pt-4 h-96">
                <Chart
                  data={graphData}
                  xKey="date"
                  yKey={graphSection === "APY" ? "apy" : "tvl"}
                  dataKey={graphSection === "APY" ? "apy" : "tvl"}
                />
              </div>
            </Box>
          </GridItem>
        </Grid>
      </PageWrapper>
    </>
  );
}
