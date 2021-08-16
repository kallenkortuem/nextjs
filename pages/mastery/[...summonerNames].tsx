import {
  ChampionMasteryV4Api,
  ChampionMasteryV4ChampionMasteryDto,
  Configuration,
  SummonerV4Api,
  SummonerV4SummonerDTO,
} from "@kallenkortuem/bookish-invention";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  LinearProgress,
  Link,
  Typography,
} from "@material-ui/core";
import {
  DataGrid,
  GridColDef,
  GridValueFormatterParams,
} from "@material-ui/data-grid";
import { formatDistanceToNowStrict } from "date-fns";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import Copyright from "../../components/Copyright";

type NarrowedGridColDef = Omit<GridColDef, "field"> & {
  field: keyof ChampionMasteryV4ChampionMasteryDto;
};

interface MasterySummonerNamesProps {
  data?:
    | {
        summoner: SummonerV4SummonerDTO;
        masteries: ChampionMasteryV4ChampionMasteryDto[];
      }[]
    | null;
}

const MasterySummonerNames = ({ data }: MasterySummonerNamesProps) => {
  const {
    query: { summonerNames },
    isFallback,
  } = useRouter();

  const columns: NarrowedGridColDef[] = [
    {
      field: "championId",
      headerName: "champion",
      // eslint-disable-next-line react/display-name
      renderCell: ({ row }) => (
        <Link variant="body2" underline="hover" color="textPrimary">
          {row?.championId}
        </Link>
      ),
    },
    { field: "championLevel", headerName: "masteryLevel"},
    {
      field: "championPoints",
      headerName: "totalPoints",
      valueFormatter: ({ value }: GridValueFormatterParams) =>
        value?.toLocaleString(),
    },
    {
      field: "lastPlayTime",
      headerName: "lastPlayTime",
      valueFormatter: ({ value }: GridValueFormatterParams) =>
        value ? formatDistanceToNowStrict((value as number) || 0) : "",
    },
  ];

  if (isFallback) {
    return <LinearProgress />;
  }

  if (!Array.isArray(summonerNames)) {
    return null;
  }

  if (!data) {
    return <Typography>No data</Typography>;
  }

  return (
    <>
    <Head>
      <title>Champion Mastery</title>
    </Head>
    <Container maxWidth="xl">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Champion Mastery
        </Typography>
        <Grid container >
          {data.map(({ summoner, masteries }) => (
            <Grid item style={{flexGrow: 1}} key={summoner.name}>
              <Card>
                <CardHeader
                  title={summoner.name}
                  subheader={`Total mastery ${masteries
                    .reduce((prev, cur) => prev + cur.championPoints, 0)
                    .toLocaleString()}`}
                    />
                <CardContent>
                  <div style={{ height: "500px", width: "100%" }}>
                    <DataGrid
                      rows={masteries.map((x) => ({ ...x, id: x.championId }))}
                      columns={columns}
                      autoPageSize
                      disableSelectionOnClick
                      />
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Link href="/mastery" color="secondary">
          Search
        </Link>
        <Copyright />
      </Box>
    </Container>
          </>
  );
};

export default MasterySummonerNames;

export const getStaticProps: GetStaticProps<MasterySummonerNamesProps> = async (
  context
) => {
  let { summonerNames } = context.params;
  if (!Array.isArray(summonerNames)) {
    return {
      props: {},
      redirect: "/mastery",
    };
  }

  // we only ever want to make 5 requests for summoner data
  summonerNames = summonerNames.slice(0, 5);

  const configuration = new Configuration({
    apiKey: process.env.RG_API_KEY,
    basePath: process.env.RG_API_BASE_URL,
  });
  const summonerApi = new SummonerV4Api(configuration);
  const championApi = new ChampionMasteryV4Api(configuration);

  const summonerApiCalls = await Promise.all(
    summonerNames.map(async (summonerName) => {
      const summonerResponse = await summonerApi.summonerV4GetBySummonerName(
        summonerName
      );

      if (summonerResponse.statusText) {
        console.log(summonerResponse.statusText);
      }
      if (summonerResponse.data) {
        const masteryResponse =
          await championApi.championMasteryV4GetAllChampionMasteries(
            summonerResponse.data.id
          );

        if (masteryResponse.data) {
          return {
            summoner: summonerResponse.data,
            masteries: masteryResponse.data,
          };
        }
      }
    })
  );

  // ...
  return {
    props: {
      data: summonerApiCalls,
    },
    // seconds * minutes = 15mins
    revalidate: 60 * 15,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // ...
  return {
    // Only `/posts/1` and `/posts/2` are generated at build time
    paths: [
      {
        params: {
          summonerNames: [
            "mgnero",
            "brian muller",
            "quite meh",
            "theezues",
            "xherooftimex",
          ],
        },
      },
    ],
    // Enable statically generating additional pages
    // For example: `/posts/3`
    fallback: true,
  };
};
