import ArbitrumLogo from "./arbitrum-arb-logo.svg";
import AvalancheLogo from "./avalanche-avax-logo.svg";
import BaseLogo from "./token_branded_base.svg";
import CodxLogo from "./codex.svg";
import Ethereum from "./ethe.svg";
import LineaLogo from "./token_linea.svg";
import OPLogo from "./token_branded_op.svg";
import Matic from "./cryptocurrency_matic.svg";
import UniLogo from "./cryptocurrency_color_uni.svg";
import WorldLogo from "./world_token.svg";
import SEILogo from "./token_branded_sei.svg";

export const TOKEN_ICONS: Record<string, React.FC<{ width?: number; height?: number }>> = {
  ethereum: Ethereum,
  polygon: Matic,
  uniswap: UniLogo,
  world: WorldLogo,
  arbitrum: ArbitrumLogo,
  avalanche: AvalancheLogo,
  codx: CodxLogo,
  base: BaseLogo,
  linea: LineaLogo,
  sei: SEILogo,
  optimism: OPLogo
};
