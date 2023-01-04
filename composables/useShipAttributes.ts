import { ShipAttribute } from '@/types/ship-attribute';
import shipAttributesData from '@/data/shipAttributes';


const useShipAttributes = () => {
  const getMemberShipAttributes = (id: string, name: string) => {
    const memberAttributes = shipAttributesData.filter((obj) => obj.userId === id)[0];

    const selectedAttributes: ShipAttribute[] = memberAttributes.attributes.filter((obj) => obj.name === name)[0].attributes
    return selectedAttributes
  }

  return {
    getMemberShipAttributes
  }
}

export default useShipAttributes;