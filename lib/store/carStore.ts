import { CarId, Filter } from "@/types/types";
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { fetchBrands, fetchCars } from "../api/carsApi";

interface CarState {
  cars: CarId[];
  favorites: CarId[];
  brands: string[];
  isLoading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  filters: Filter;

  loadCars: (isLoadMore?: boolean) => Promise<void>;
  loadBrands: () => Promise<void>;
  setFilter: (key: keyof Filter, value: string) => void;
  toggleFavorite: (car: CarId) => void;
  resetCars: () => void;
  setAllFilters: (filters: Filter) => void;
}

export const useCarStore = create<CarState>()(
  devtools(
    persist(
      (set, get) => ({
        cars: [],
        favorites: [],
        brands: [],
        isLoading: false,
        error: null,
        page: 1,
        totalPages: 1,
        filters: {},

        loadCars: async (isLoadMore = false) => {
          
          if (get().isLoading) return;
        
          set({ isLoading: true, error: null });
          
         
          const currentPage = isLoadMore ? get().page : 1;
          const filters = get().filters;
        
          try {
            const data = await fetchCars({ page: currentPage, filters });
        
            
            const newCars = (Array.isArray(data) ? data : data.cars) as CarId[];
            const totalPages = data.totalPages || 1;
        
            set((state) => {
            
              const combinedCars = isLoadMore ? [...state.cars, ...newCars] : newCars;
            
              
              const uniqueCars = combinedCars.filter((car, index, self) =>
                index === self.findIndex((c) => c.id === car.id)
              );
            
              return {
                cars: uniqueCars, 
                page: currentPage + 1,
                totalPages: totalPages,
                isLoading: false,
              };
            });
          } catch (err) {
            let message = "Something went wrong";
            if (err instanceof Error) {
              message = err.message;
            }
            set({ error: message, isLoading: false });
          }
        },

        loadBrands: async () => {
          try {
            const brands = await fetchBrands();
            set({ brands });
          } catch (error) {
            console.error(error);
          }
        },

        setFilter: (key, value) => {
          set((state) => ({
            filters: { ...state.filters, [key]: value },
            page: 1,
          }));
          get().loadCars(false);
        },

        setAllFilters: (newFilters) => {
          set({
            filters: newFilters,
            page: 1,
            cars: [],
          });
          get().loadCars(false);
        },

        toggleFavorite: (car) => {
          set((state) => {
            const isFav = state.favorites.some((c) => c.id === car.id);
            if (isFav) {
              return {
                favorites: state.favorites.filter((c) => c.id !== car.id),
              };
            }
            return { favorites: [...state.favorites, car] };
          });
        },

        resetCars: () => set({ cars: [], page: 1 }),
      }),
      {
        name: "rental-car-storage",
        partialize: (state) => ({ favorites: state.favorites }),
      }
    )
  )
);
