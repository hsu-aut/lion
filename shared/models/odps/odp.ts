
export enum OdpName {
	VDI3682 = "VDI3682",
	VDI2206 = "VDI2206",
	ISA88 = "ISA88",
	DINEN61360 = "DINEN61360",
	WADL = "WADL",
	ISO22400_2 = "ISO22400_2",
	OPCUA = "OPCUA",
}


export interface OdpInfo {
	name: OdpName,
	odpUrl: string,
	odpVersionUrl: string
	versions: Array<string>
}