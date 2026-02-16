export const CARD_STORAGE_KEY = "user_cards";

export interface Card {
    id?: string;
    name: string;
    dia_vencimento?: number;
    data_vencimento?: number;
    slug: string;
    user_id?: string | number;
    value?: string; // Para compatibilidade com componentes que usam 'value'
}

/**
 * Salva a lista completa de cartões no LocalStorage.
 */
export const saveCardsToStorage = (cards: Card[]) => {
    localStorage.setItem(CARD_STORAGE_KEY, JSON.stringify(cards));
};

/**
 * Retorna a lista de cartões armazenada no LocalStorage.
 */
export const getCardsFromStorage = (): Card[] => {
    const cards = localStorage.getItem(CARD_STORAGE_KEY);
    return cards ? JSON.parse(cards) : [];
};

/**
 * Adiciona ou atualiza um cartão no LocalStorage.
 */
export const upsertCardInStorage = (card: Card) => {
    const cards = getCardsFromStorage();
    const index = cards.findIndex(c => c.id === card.id || c.slug === card.slug);

    if (index !== -1) {
        cards[index] = card;
    } else {
        cards.push(card);
    }

    saveCardsToStorage(cards);
};

/**
 * Remove um cartão do LocalStorage pelo ID ou Slug.
 */
export const removeCardFromStorage = (id?: string, slug?: string) => {
    let cards = getCardsFromStorage();
    cards = cards.filter(c => c.id !== id && c.slug !== slug);
    saveCardsToStorage(cards);
};

/**
 * Limpa todos os cartões do LocalStorage (usado no logout).
 */
export const clearCardsStorage = () => {
    localStorage.removeItem(CARD_STORAGE_KEY);
};
