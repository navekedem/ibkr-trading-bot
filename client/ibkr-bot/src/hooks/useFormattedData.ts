import { Company } from "../../../../types/company-api"

export const useFormattedData = (data: any) => {
    return data?.results?.map((company: Company, index: number) => ({
        id: index,
        ...company
    })) || []
}