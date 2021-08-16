import { Box, Container, Link, Typography } from "@material-ui/core";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import Copyright from "../../components/Copyright";
import ProTip from "../../components/ProTip";

const MasterySummonerNames = () => {
  const router = useRouter();
  const { summonerNames } = router.query;
  if (!Array.isArray(summonerNames)) {
    return null;
  }

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Next.js example {summonerNames}
        </Typography>
        <Link href="/about" color="secondary">
          Go to the about page
        </Link>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
};

export default MasterySummonerNames;

export const getStaticProps: GetStaticProps = async (context) => {
  // ...
  return {
    props: {},
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
      }
    ],
    // Enable statically generating additional pages
    // For example: `/posts/3`
    fallback: true,
  };
};
