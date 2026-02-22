import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  sizes: number[];
  category: string;
  isBestSeller?: boolean;
  isPromo?: boolean;
  description: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Mercurial Vapor XV Elite FG",
    brand: "Nike",
    price: 1890,
    originalPrice: 2490,
    image: product1,
    images: [product1],
    sizes: [39, 40, 41, 42, 43, 44, 45],
    category: "Terrain sec",
    isBestSeller: true,
    isPromo: true,
    description: "Vitesse explosive sur terrain sec. Chaussure légère avec technologie Flyknit pour un contrôle optimal du ballon.",
  },
  {
    id: "2",
    name: "Predator Edge+ FG",
    brand: "Adidas",
    price: 2190,
    image: product2,
    images: [product2],
    sizes: [39, 40, 41, 42, 43, 44],
    category: "Terrain sec",
    isBestSeller: true,
    description: "Puissance et précision maximales. Zone de frappe texturée pour des tirs dévastateurs.",
  },
  {
    id: "3",
    name: "Future Ultimate FG",
    brand: "Puma",
    price: 1590,
    originalPrice: 1990,
    image: product3,
    images: [product3],
    sizes: [40, 41, 42, 43, 44, 45],
    category: "Terrain sec",
    isPromo: true,
    description: "Agilité et créativité sans limites. FUZIONFIT+ pour un ajustement personnalisé.",
  },
  {
    id: "4",
    name: "Phantom Luna Elite FG",
    brand: "Nike",
    price: 2390,
    image: product4,
    images: [product4],
    sizes: [39, 40, 41, 42, 43, 44, 45],
    category: "Terrain sec",
    isBestSeller: true,
    description: "Toucher de balle exceptionnel avec technologie All Conditions Control pour jouer par tous les temps.",
  },
  {
    id: "5",
    name: "X Speedportal.1 FG",
    brand: "Adidas",
    price: 1790,
    image: product5,
    images: [product5],
    sizes: [40, 41, 42, 43, 44],
    category: "Terrain sec",
    description: "Vitesse pure. Construction légère et plaque de semelle SPEEDFRAME pour une accélération fulgurante.",
  },
  {
    id: "6",
    name: "Tiempo Legend 10 Elite FG",
    brand: "Nike",
    price: 1990,
    originalPrice: 2290,
    image: product6,
    images: [product6],
    sizes: [39, 40, 41, 42, 43, 44, 45],
    category: "Terrain sec",
    isPromo: true,
    description: "Le cuir premium rencontre la technologie moderne. Confort et toucher inégalés.",
  },
];

export const brands = ["Nike", "Adidas", "Puma"];
export const sizes = [39, 40, 41, 42, 43, 44, 45];
