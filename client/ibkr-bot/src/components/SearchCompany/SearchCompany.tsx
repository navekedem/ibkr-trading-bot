import { Box } from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Text } from "@chakra-ui/react";
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import { getCompanies } from '../../api/get-companies/get-companies'
import { useFormattedData } from '../../hooks/useFormattedData'
import { Company } from '../../types/company-api'

export const SearchCompany: React.FC<{setSelectedStock: React.Dispatch<React.SetStateAction<Company | null>>}> = ({setSelectedStock}) => {
    const [formattedData, setFormattedData] = useState<Company[]>([])
    const { mutate, isLoading } = useMutation({
        mutationFn: (searchValue: string) => getCompanies(searchValue),
        onSuccess(data, variables, context) {
            setFormattedData(useFormattedData(data))
        },
    })

    const handleOnSearch = (searchValue: string, results: any) => {
        if (searchValue.length < 2) return
        mutate(searchValue)
    }

    const handleOnSelect = (item: Company) => {
        setSelectedStock(item)
    }

    const formatResult = (item: Company) => {
        return (
            <div key={item.cik}>
                <Text as='b'>{item.ticker}</Text><br/>
                <Text as='i'>{item.name}</Text>
            </div>
        )
    }

    return <Box width={400} margin={'1rem auto'}>
        <ReactSearchAutocomplete
            items={formattedData}
            placeholder={"Search Company"}
            fuseOptions={{ keys: ['name', 'ticker'] }}
            onSearch={handleOnSearch}
            onSelect={handleOnSelect}
            inputDebounce={300}
            autoFocus
            formatResult={formatResult}
            styling={{
                zIndex: 999
            }}
        />
    </Box>
}