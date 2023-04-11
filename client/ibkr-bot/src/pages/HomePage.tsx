import { Flex } from "@chakra-ui/react"
import { AppBar } from "../components/AppBar/AppBar"
import { MarketDataGraphs } from "../components/market-data-graph/market-data-graphs"
import { SearchCompany } from "../components/SearchCompany/SearchCompany"

export const HomePage: React.FC = () => {
    return <Flex flexDirection={'column'} >
        <AppBar />
        <SearchCompany />
        <MarketDataGraphs />
    </Flex>
}