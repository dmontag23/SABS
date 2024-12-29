import {useQuery} from "@tanstack/react-query";

import {todayTixAPIv2} from "../../api/axiosConfig";
import {TodayTixAPIv2ErrorResponse} from "../../types/base";
import {TodayTixCustomer} from "../../types/customer";

const getCurrentCustomer = async () =>
  (await todayTixAPIv2.get<TodayTixCustomer>("customers/me")).data.data;

type UseGetCustomersMeProps = {
  enabled?: boolean;
};

const useGetCustomersMe = ({enabled}: UseGetCustomersMeProps = {}) =>
  useQuery<TodayTixCustomer, TodayTixAPIv2ErrorResponse>({
    queryKey: ["customer"],
    queryFn: getCurrentCustomer,
    enabled
  });

export default useGetCustomersMe;
