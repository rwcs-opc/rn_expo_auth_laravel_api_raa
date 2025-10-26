import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    category: string;
}

export default function CartScreen() {
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: '1',
            name: 'Fresh Vegetables Pack',
            price: 299,
            quantity: 2,
            image: '🥬',
            category: 'Grocery',
        },
        {
            id: '2',
            name: 'Chicken Biryani',
            price: 249,
            quantity: 1,
            image: '🍛',
            category: 'Food',
        },
        {
            id: '3',
            name: 'Paracetamol 500mg',
            price: 45,
            quantity: 3,
            image: '💊',
            category: 'Medicine',
        },
        {
            id: '4',
            name: 'Fresh Milk 1L',
            price: 65,
            quantity: 2,
            image: '🥛',
            category: 'Grocery',
        },
    ]);

    const updateQuantity = (id: string, change: number) => {
        setCartItems((prevItems) =>
            prevItems
                .map((item) => {
                    if (item.id === id) {
                        const newQuantity = item.quantity + change;
                        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
                    }
                    return item;
                })
                .filter((item): item is CartItem => item !== null)
        );
    };

    const removeItem = (id: string) => {
        Alert.alert('Remove Item', 'Are you sure you want to remove this item?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Remove',
                style: 'destructive',
                onPress: () => setCartItems((prevItems) => prevItems.filter((item) => item.id !== id)),
            },
        ]);
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const deliveryFee = 40;
    const subtotal = calculateSubtotal();
    const total = subtotal + deliveryFee;

    const handleCheckout = () => {
        Alert.alert(
            'Checkout',
            `Total Amount: ₹${total}\n\nProceed to payment?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Proceed',
                    onPress: () => Alert.alert('Success', 'Order placed successfully!'),
                },
            ]
        );
    };

    const renderCartItem = ({ item }: { item: CartItem }) => (
        <View style={styles.cartItem}>
            <View style={styles.itemImageContainer}>
                <Text style={styles.itemImage}>{item.image}</Text>
            </View>
            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCategory}>{item.category}</Text>
                <Text style={styles.itemPrice}>₹{item.price}</Text>
            </View>
            <View style={styles.itemActions}>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.id, -1)}
                    >
                        <Text style={styles.quantityButtonText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.id, 1)}
                    >
                        <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => removeItem(item.id)}>
                    <Text style={styles.removeButton}>🗑️</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (cartItems.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>My Cart</Text>
                </View>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>🛒</Text>
                    <Text style={styles.emptyText}>Your cart is empty</Text>
                    <Text style={styles.emptySubtext}>Add items to get started</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Cart</Text>
                <Text style={styles.itemCount}>{cartItems.length} items</Text>
            </View>

            <FlatList
                data={cartItems}
                renderItem={renderCartItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
            />

            <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryValue}>₹{subtotal}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Delivery Fee</Text>
                    <Text style={styles.summaryValue}>₹{deliveryFee}</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>₹{total}</Text>
                </View>

                <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                    <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
    },
    itemCount: {
        fontSize: 14,
        color: '#666666',
    },
    listContent: {
        padding: 16,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    itemImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemImage: {
        fontSize: 32,
    },
    itemDetails: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 4,
    },
    itemCategory: {
        fontSize: 12,
        color: '#999999',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#E23744',
    },
    itemActions: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 4,
    },
    quantityButton: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 6,
    },
    quantityButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E23744',
    },
    quantityText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginHorizontal: 12,
    },
    removeButton: {
        fontSize: 20,
        marginTop: 8,
    },
    summaryContainer: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666666',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333333',
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 12,
        marginTop: 4,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E23744',
    },
    checkoutButton: {
        backgroundColor: '#E23744',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
        shadowColor: '#E23744',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    checkoutButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIcon: {
        fontSize: 80,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#666666',
    },
});
