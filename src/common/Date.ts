import {useMemo} from "react";
import {parse} from "date-fns";

export const useParsedDate = (date: string) => useMemo(() => parse(date, 'yyyy-MM-dd', new Date()), [date]);
