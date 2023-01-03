/**
 * interface to define a configuration of one page, consistiing of multiple cards
 */
export interface GenericOdpConfig {
    title: string,
    descriptionText: string,
    cardConfigs: Array<GenericCardConfig>
}

/**
 * interface to define contents of one card
 */
export interface GenericCardConfig {
    id: number,
    type: string,
    title: string,
    descriptionText: string,
    data: any
}