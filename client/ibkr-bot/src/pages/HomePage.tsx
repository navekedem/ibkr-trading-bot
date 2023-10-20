import { Flex } from "@chakra-ui/react"
import { useState } from "react"
import { AppBar } from "../components/AppBar/AppBar"
import { MarketDataGraphs } from "../components/market-data-graph/market-data-graphs"
import { SearchCompany } from "../components/SearchCompany/SearchCompany"
import { Company } from "../../../../types/company-api"

export const HomePage: React.FC = () => {
    const [selectedStock, setSelectedStock] = useState<Company | null>(null)

    return <Flex flexDirection={'column'} >
        <AppBar />
        <SearchCompany setSelectedStock={setSelectedStock} />
        <MarketDataGraphs selectedStock={selectedStock} />
    </Flex>
}