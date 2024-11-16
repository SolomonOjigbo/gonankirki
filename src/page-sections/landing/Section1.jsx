import Image from "next/image";
import { Box, Button, Card, Container, Stack, keyframes, styled } from "@mui/material"; // CUSTOM COMPONENT
import Logo from "../../../public/static/logo/logo.png"
import { H1, Paragraph } from "components/typography"; // CUSTOM DEFINED HOOK

import useNavigate from "hooks/useNavigate";
const shine = keyframes`
0% {
  background-position: 0% 50%;
}
100% {
  background-position: 100% 50%;
}
`;
const animated = keyframes`
0% {
	background-position: 0 0;
}
50% {
  background-position: 300% 0%;
}
100% {
	background-position: 0 0;
}
`; // STYLED COMPONENTS

const MainTitle = styled(H1)(() => ({
  background: `linear-gradient(300deg, #6950E8 0%,#FB6186 25%, #6950E8 50%, #FB6186 75%,#6950E8 100%)`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textFillColor: "transparent",
  backgroundSize: "150% auto",
  animation: `${shine} 2s ease-in-out infinite alternate`
}));
const ImageBox = styled(Box)(({
  theme
}) => {
  const color = `${theme.palette.primary[600]}, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.success.main}, ${theme.palette.warning.main}, ${theme.palette.error.main}, ${theme.palette.info.main}, ${theme.palette.primary[400]}`;
  const COMMON_STYLE = {
    top: -3,
    left: -3,
    content: "''",
    borderRadius: 16,
    background: `linear-gradient(45deg, ${color})`,
    position: "absolute",
    backgroundSize: "300%",
    width: "calc(100% + 6px)",
    height: "calc(100% + 6px)",
    animation: `${animated} 20s linear infinite`
  };
  return {
    position: "relative",
    ":before": { ...COMMON_STYLE
    },
    ":after": { ...COMMON_STYLE,
      filter: "blur(8px)"
    }
  };
});
const ShadowBox = styled(Box)(({
  value
}) => ({
  background: `rgba(255,255,255, ${value || 0.012})`,
  borderRadius: 24,
  padding: 32
}));

const Section1 = () => {
  const navigate = useNavigate();
  return <Box bgcolor="#ffffff" py={4}>
      <Container maxWidth="md">

        <Box textAlign="center" mb={5} mt={10}>
          <Image height={168} width={400} src={Logo} />
          <Paragraph color="#000000" fontSize={42} fontWeight={600}>
            Welcome to
          </Paragraph>

          <MainTitle fontSize={68} fontWeight={800}>
            Gonankirki Dashboard
          </MainTitle>

          <Paragraph color="#000000" fontSize={18} mt={1}>
            Data Aggregation & Visualization Center
          </Paragraph>

          <Stack mt={6} direction="row" gap={2} alignItems="center" justifyContent="center">
            <Button onClick={() => window.location.href("https://gonankirki.com")} sx={{
            paddingInline: 3,
            paddingBlock: 1
          }}>
              About Gonankirki
            </Button>

            <Button variant="outlined" onClick={() => navigate("/dashboard")} sx={{
            paddingInline: 3,
            paddingBlock: 1
          }}>
              Go to Dashboard
            </Button>
          </Stack>
        </Box>

        
      </Container>
    </Box>;
};

export default Section1;