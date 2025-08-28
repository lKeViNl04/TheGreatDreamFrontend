import { MemberDTO } from "../../../../member/models/member-dto";

export interface MonthlyFeeDTO {
    id: number;
    cashBoxId: number;
    member: MemberDTO;
    assignedAmount: number;
    paid:number;
    status: string ; 
}
