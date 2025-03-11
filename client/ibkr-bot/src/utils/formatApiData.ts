import { Company } from '@app-types/company';

export const formatData = (data: any) => {
    return (
        data?.results?.map((company: Company, index: number) => ({
            id: index,
            ...company,
        })) || []
    );
};
