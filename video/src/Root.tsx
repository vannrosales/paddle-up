import React from "react";
import { AbsoluteFill, Audio, Composition, Sequence, staticFile } from "remotion";
import { S1Hook, S2Logo, S3Passport } from "./scenes/A";
import { S4Share, S5Badges } from "./scenes/B";
import { S6Finder, S7Finale, Hero10 } from "./scenes/C";

export const PaddleUp40Comp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#030402" }}>
      <Audio src={staticFile("audio/paddleup40.wav")} />
      {/* Scene 1: Hook (0–100) */}
      <Sequence from={0} durationInFrames={100}>
        <S1Hook />
      </Sequence>
      {/* Scene 3: Player Passport (145–400) — rendered beneath Scene 2's wipe */}
      <Sequence from={145} durationInFrames={255}>
        <S3Passport />
      </Sequence>
      {/* Scene 2: Ball -> Shader Pill -> Logo wipe (60–165) */}
      <Sequence from={60} durationInFrames={105}>
        <S2Logo />
      </Sequence>
      {/* Scene 4: Shareable Wallet Pass & Dynamic OG Cards (385–630) */}
      <Sequence from={385} durationInFrames={245}>
        <S4Share />
      </Sequence>
      {/* Scene 5: Peer Endorsements & Badges (615–860) */}
      <Sequence from={615} durationInFrames={245}>
        <S5Badges />
      </Sequence>
      {/* Scene 6: Partner Finder & Match Log (845–1070) */}
      <Sequence from={845} durationInFrames={225}>
        <S6Finder />
      </Sequence>
      {/* Scene 7: Finale Lockup & Signature Shader CTA (1055–1200) */}
      <Sequence from={1055} durationInFrames={145}>
        <S7Finale />
      </Sequence>
    </AbsoluteFill>
  );
};

export const PaddleUpHero10Comp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#030402" }}>
      <Audio src={staticFile("audio/paddleup10.wav")} />
      <Hero10 />
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="PaddleUpHero10"
        component={PaddleUpHero10Comp}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PaddleUp40"
        component={PaddleUp40Comp}
        durationInFrames={1200}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

