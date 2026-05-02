export interface Outfit {
  id: number;
  style: string;
  gender: 'Male' | 'Female' | 'Unisex';
  description: string;
  rentPrice: number;
  buyLink: string;
  imageUrl: string;
}

export const OUTFITS: Outfit[] = [
  { id: 1, style: 'Old Money', gender: 'Male', description: 'Áo sơ mi trắng + Quần tây be', rentPrice: 120000, buyLink: 'https://vn.shp.ee/sbx3mejR', imageUrl: 'https://pin.it/6ZjapJHpz' },
  { id: 2, style: 'Vintage', gender: 'Female', description: 'Váy hoa vintage nhẹ nhàng', rentPrice: 90000, buyLink: 'https://vn.shp.ee/wK9crev2', imageUrl: 'https://pin.it/40PKstcIa' },
  { id: 3, style: 'Streetwear', gender: 'Male', description: 'Hoodie + Quần cargo', rentPrice: 150000, buyLink: 'https://vn.shp.ee/7yEtQWy7', imageUrl: 'https://pin.it/3qSBwyMxE' },
  { id: 4, style: 'Old Money', gender: 'Female', description: 'Váy dài thanh lịch + túi xách + giày cao gót', rentPrice: 120000, buyLink: 'https://vn.shp.ee/oUgfpJTh', imageUrl: 'https://pin.it/3kNQDCACh' },
  { id: 5, style: 'Vintage', gender: 'Male', description: 'Sơ mi họa tiết + quần âu + giày loafer', rentPrice: 150000, buyLink: 'https://vn.shp.ee/sRtMK4fq', imageUrl: 'https://pin.it/7GbusMqCY' },
  { id: 6, style: 'Streetwear', gender: 'Female', description: 'Áo oversize + quần short + sneaker', rentPrice: 100000, buyLink: 'https://vn.shp.ee/gJrmqNPp', imageUrl: 'https://pin.it/3ZhQqvDin' },
  { id: 7, style: 'Streetwear', gender: 'Male', description: 'Áo thể thao + quần bò', rentPrice: 50000, buyLink: 'https://vn.shp.ee/gJrmqNPp', imageUrl: 'https://pin.it/5gsfcdzHt' },
  { id: 8, style: 'Streetwear', gender: 'Female', description: 'Áo thun + quần âu + giày thể thao', rentPrice: 80000, buyLink: 'https://vn.shp.ee/GGVUM4xm', imageUrl: 'https://pin.it/3ZhQqvDin' },
  { id: 9, style: 'Trendy', gender: 'Male', description: 'Áo sơ mi đen + quần vải nâu', rentPrice: 150000, buyLink: 'https://vn.shp.ee/icjWBkV4', imageUrl: 'https://pin.it/398GnodFO' },
  { id: 10, style: 'Trendy', gender: 'Female', description: 'Áo thun đen + quần baggy', rentPrice: 80000, buyLink: 'https://vn.shp.ee/CHAuXfKQ', imageUrl: 'https://pin.it/5DLxS8a2U' },
  { id: 11, style: 'Old Money', gender: 'Male', description: 'Áo polo + quần âu', rentPrice: 70000, buyLink: 'https://vn.shp.ee/tPaZKD1J', imageUrl: 'https://pin.it/6x0XMLngu' },
  { id: 12, style: 'Old Money', gender: 'Female', description: 'Váy liền + giày cao gót', rentPrice: 90000, buyLink: 'https://vn.shp.ee/tPaZKD1J', imageUrl: 'https://pin.it/7M9zZfQym' },
  { id: 13, style: 'Vintage', gender: 'Male', description: 'Áo khoác + quần jean', rentPrice: 70000, buyLink: 'https://vn.shp.ee/PFsxC24g', imageUrl: 'https://pin.it/3y54o0epC' },
  { id: 14, style: 'Vintage', gender: 'Female', description: 'Áo + quần bò', rentPrice: 60000, buyLink: 'https://vn.shp.ee/zGsGXqXE', imageUrl: 'https://pin.it/5zI5NIwfT' },
  { id: 15, style: 'Trendy', gender: 'Male', description: 'Áo khoác + áo dài + quần ống rộng', rentPrice: 80000, buyLink: 'https://vn.shp.ee/UvZoiLdQ', imageUrl: 'https://pin.it/49CnBDjcS' },
  { id: 16, style: 'Trendy', gender: 'Female', description: 'Áo khoác + áo ngắn tay + quần jean ống rộng', rentPrice: 100000, buyLink: 'https://vn.shp.ee/UvZoiLdQ', imageUrl: 'https://pin.it/wMmq3ojAo' },
  { id: 17, style: 'Minimalism', gender: 'Male', description: 'Áo khoác jean + quần caro', rentPrice: 60000, buyLink: 'https://vn.shp.ee/Q6DziuJc', imageUrl: 'https://pin.it/3ypOuTftA' },
  { id: 18, style: 'Minimalism', gender: 'Female', description: 'Áo gile + quần caro', rentPrice: 70000, buyLink: 'https://vn.shp.ee/Dn9qWwwb', imageUrl: 'https://pin.it/3ypOuTftA' },
  { id: 19, style: 'Minimalism', gender: 'Male', description: 'Áo polo + quần jean', rentPrice: 70000, buyLink: 'https://vn.shp.ee/TuxnpnAd', imageUrl: 'https://pin.it/38InZWGWN' },
  { id: 20, style: 'Minimalism', gender: 'Female', description: 'Áo polo + quần âu', rentPrice: 80000, buyLink: 'https://vn.shp.ee/HyNCpTw8', imageUrl: 'https://pin.it/3NDESgvHD' },
  { id: 21, style: 'Minimalism', gender: 'Male', description: 'Sơ mi + quần tây + giày da', rentPrice: 150000, buyLink: 'https://vn.shp.ee/Dn9qWwwb', imageUrl: 'https://pin.it/1WVL6OR19' },
  { id: 22, style: 'Minimalism', gender: 'Female', description: 'Áo blouse + chân váy + giày cao gót', rentPrice: 130000, buyLink: 'https://vn.shp.ee/nANjAxnZ', imageUrl: 'https://pin.it/1APNUxU0k' },
  { id: 23, style: 'Old Money', gender: 'Male', description: 'Áo khoác jean + quần jean', rentPrice: 150000, buyLink: 'https://vn.shp.ee/HoriJvL4', imageUrl: 'https://pin.it/51PmKU54V' },
  { id: 24, style: 'Old Money', gender: 'Female', description: 'Áo croptop + quần jean + sneaker', rentPrice: 120000, buyLink: 'https://vn.shp.ee/AWhAVntg', imageUrl: 'https://pin.it/5HN5CzSZ8' },
  { id: 25, style: 'Vintage', gender: 'Male', description: 'Vest + quần âu + giày', rentPrice: 130000, buyLink: 'https://vn.shp.ee/LWFXUVB1', imageUrl: 'https://pin.it/366avn43m' },
  { id: 26, style: 'Vintage', gender: 'Female', description: 'Áo 2 cổ + quần vải', rentPrice: 140000, buyLink: 'https://vn.shp.ee/hYnPjwcu', imageUrl: 'https://pin.it/5GwqC3I7k' },
  { id: 27, style: 'Streetwear', gender: 'Male', description: 'Áo hoodie + quần ống rộng', rentPrice: 90000, buyLink: 'https://vn.shp.ee/Wwie91K9', imageUrl: 'https://pin.it/jy4eShFd4' },
  { id: 28, style: 'Streetwear', gender: 'Female', description: 'Áo hoodie + quần ống rộng', rentPrice: 90000, buyLink: 'https://vn.shp.ee/Wwie91K9', imageUrl: 'https://pin.it/jy4eShFd4' },
  { id: 29, style: 'Old Money', gender: 'Female', description: 'Áo măng tô + quần âu + giày cao gót', rentPrice: 120000, buyLink: 'https://vn.shp.ee/Ckz4Q72h', imageUrl: 'https://pin.it/6DkJUW09G' },
];

export const STYLES = ['Tất cả', 'Old Money', 'Vintage', 'Streetwear', 'Trendy', 'Minimalism'];
export const GENDERS = ['Tất cả', 'Male', 'Female'];
