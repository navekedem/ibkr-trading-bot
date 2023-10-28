import { Button, Flex, Heading, Stack } from "@chakra-ui/react"
import { MdZoomInMap } from "react-icons/md"

export const LayoutItemTitle: React.FC<{ title: string, chartId: string }> = ({ title, chartId }) => {

    const resetChartZoom = () => {
        ApexCharts.exec(chartId, 'resetSeries')
    }

    return <Flex justifyContent={'space-between'} alignItems={'center'} padding={"0px 10px"}>
        <Heading className="layout-block-title" as={'h4'} size='md'>{title}</Heading>
        <Stack direction='row' spacing={4}>
            <Button size={'sm'} leftIcon={<MdZoomInMap />} onClick={resetChartZoom} colorScheme='blue' variant='solid'>
                Reset Zoom
            </Button>
        </Stack>
    </Flex>
}   