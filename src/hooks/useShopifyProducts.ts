import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchProductByHandle, ShopifyProduct } from '@/lib/shopify';

export function useShopifyProducts(first = 20, query?: string) {
  return useQuery<ShopifyProduct[]>({
    queryKey: ['shopify-products', first, query],
    queryFn: () => fetchProducts(first, query),
  });
}

export function useShopifyProduct(handle: string) {
  return useQuery({
    queryKey: ['shopify-product', handle],
    queryFn: () => fetchProductByHandle(handle),
    enabled: !!handle,
  });
}
