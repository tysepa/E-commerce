import React, { createContext, useContext, useState, useEffect } from 'react';

const Web3Context = createContext();

// Preloaded mock products to populate the store on first load
const INITIAL_PRODUCTS = [
  {
    id: '1',
    name: 'Kigali Handcrafted Leather Brogues',
    category: "Men's Shoes",
    priceEth: 0.035,
    priceUsd: 115.50,
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=600',
    description: 'Masterfully crafted in Rwanda using premium full-grain local leather. Perfect blend of traditional craftsmanship and modern men\'s style.',
    isMadeInRwanda: true,
    isElectrical: false,
    tokenStandard: 'ERC-1155',
    contractAddress: '0xRw8bF...3a29',
    ipfsHash: 'ipfs://QmZzW...rP12'
  },
  {
    id: '2',
    name: 'Traditional Umushanana Formal Vest',
    category: "Men's Styles",
    priceEth: 0.050,
    priceUsd: 165.00,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600',
    description: 'A modern, styled interpretation of the Rwandan traditional Umushanana drape. Custom-fitted for celebratory events and cultural prestige.',
    isMadeInRwanda: true,
    isElectrical: false,
    tokenStandard: 'ERC-1155',
    contractAddress: '0xRw8bF...92e1',
    ipfsHash: 'ipfs://QmXyT...qA84'
  },
  {
    id: '3',
    name: 'Rwanda Premium Sisal Fiber Fedora',
    category: "Men's Styles",
    priceEth: 0.020,
    priceUsd: 66.00,
    image: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&q=80&w=600',
    description: 'Woven entirely by hand by local artisans in Muhanga using authentic sisal fibers. High-contrast premium accessory for sunny Kigali days.',
    isMadeInRwanda: true,
    isElectrical: false,
    tokenStandard: 'ERC-1155',
    contractAddress: '0xRw8bF...77c3',
    ipfsHash: 'ipfs://QmTtU...kB99'
  },
  {
    id: '4',
    name: 'Kigali Copper Shield Insulated Cable 2.5mm',
    category: 'Electrical Materials',
    priceEth: 0.018,
    priceUsd: 59.40,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600',
    description: 'High-conductivity insulated copper wire manufactured locally to meet premium international safety specifications. Highly durable shielding.',
    isMadeInRwanda: true,
    isElectrical: true,
    tokenStandard: 'ERC-20',
    contractAddress: '0xEl3cX...11b2',
    ipfsHash: 'ipfs://QmPyD...vG43'
  },
  {
    id: '5',
    name: 'Premium Leather Chelsea Boots',
    category: "Men's Shoes",
    priceEth: 0.045,
    priceUsd: 148.50,
    image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=600',
    description: 'Sleek slip-on design featuring flexible elastic side panels and durable Goodyear-welted rubber outsoles. Pure sophistication.',
    isMadeInRwanda: false,
    isElectrical: false,
    tokenStandard: 'ERC-1155',
    contractAddress: '0xSh9aA...44d9',
    ipfsHash: 'ipfs://QmNsW...zY77'
  },
  {
    id: '6',
    name: 'Smart LED Recessed Panel Light (15W)',
    category: 'Electrical Materials',
    priceEth: 0.006,
    priceUsd: 19.80,
    image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=600',
    description: 'Ultra-slim smart recessed LED panel. Features white-balance adjustment and app connectivity. High energy savings.',
    isMadeInRwanda: false,
    isElectrical: true,
    tokenStandard: 'ERC-1155',
    contractAddress: '0xEl3cX...88f1',
    ipfsHash: 'ipfs://QmWwQ...xL35'
  },
  {
    id: '7',
    name: 'Linen Casual Summer Shirt',
    category: "Men's Clothes",
    priceEth: 0.015,
    priceUsd: 49.50,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=600',
    description: 'Breathable lightweight organic linen. Features clean modern stitching, structured collar, and single patch chest pocket.',
    isMadeInRwanda: false,
    isElectrical: false,
    tokenStandard: 'ERC-1155',
    contractAddress: '0xCl2bB...02a3',
    ipfsHash: 'ipfs://QmFfE...rK22'
  },
  {
    id: '8',
    name: 'Inyange Premium Cotton Indigo Shirt',
    category: "Men's Clothes",
    priceEth: 0.025,
    priceUsd: 82.50,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=600',
    description: 'Soft combed cotton shirt custom dyed with natural indigo dyes by artisans in Kigali. Represents contemporary Rwandan men\'s apparel.',
    isMadeInRwanda: true,
    isElectrical: false,
    tokenStandard: 'ERC-1155',
    contractAddress: '0xRw8bF...44e5',
    ipfsHash: 'ipfs://QmRrM...jP31'
  },
  /* --- Caps of Men's --- */
  {
    id: '9',
    name: 'Kigali Urban Denim Snapback',
    category: "Men's Styles",
    priceEth: 0.007,
    priceUsd: 23.10,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=600',
    description: 'Classic flat-brim snapback featuring a custom structured crown and local linen stitch patch detailing.',
    isMadeInRwanda: false,
    isElectrical: false,
    tokenStandard: 'ERC-1155',
    contractAddress: '0xCp8aA...12e1',
    ipfsHash: 'ipfs://QmCpX...d233'
  },
  {
    id: '10',
    name: 'Made in Rwanda Sisal Panama Hat',
    category: "Men's Styles",
    priceEth: 0.018,
    priceUsd: 59.40,
    image: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&q=80&w=600',
    description: 'Premium light-woven Panama hat handwoven from organic sisal fiber by women cooperatives in southern Rwanda.',
    isMadeInRwanda: true,
    isElectrical: false,
    tokenStandard: 'ERC-1155',
    contractAddress: '0xCp8aA...98a1',
    ipfsHash: 'ipfs://QmCpX...k321'
  },
  {
    id: '11',
    name: 'Retro Wool Tweed Flat Cap',
    category: "Men's Styles",
    priceEth: 0.012,
    priceUsd: 39.60,
    image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=600',
    description: 'Structured flat cap in a heavy wool blend. Features soft inner lining and snap-front brim for a timeless look.',
    isMadeInRwanda: false,
    isElectrical: false,
    tokenStandard: 'ERC-1155',
    contractAddress: '0xCp8aA...55f2',
    ipfsHash: 'ipfs://QmCpX...j888'
  },
  {
    id: '12',
    name: 'Kigali Street Breathable Runner Cap',
    category: "Men's Styles",
    priceEth: 0.005,
    priceUsd: 16.50,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=600',
    description: 'Ultra-lightweight mesh panels runner cap. Quick-dry technology ideal for sports and casual street style.',
    isMadeInRwanda: false,
    isElectrical: false,
    tokenStandard: 'ERC-1155',
    contractAddress: '0xCp8aA...22c1',
    ipfsHash: 'ipfs://QmCpX...b099'
  },
  /* --- Colored T-Shirts --- */
  {
    id: '13',
    name: 'Kigali Classic Combed Tee (Classic White)',
    category: "Men's Clothes",
    priceEth: 0.006,
    priceUsd: 19.80,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600',
    description: '100% premium combed organic cotton. Pure white, pre-shrunk, soft ribbing collar, and seamless construction.',
    isMadeInRwanda: false,
    isElectrical: false,
    tokenStandard: 'ERC-1155',
    contractAddress: '0xTs5bB...11a2',
    ipfsHash: 'ipfs://QmTsY...w321'
  },
  {
    id: '14',
    name: 'Kigali Classic Combed Tee (Obsidian Black)',
    category: "Men's Clothes",
    priceEth: 0.006,
    priceUsd: 19.80,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=600',
    description: 'Premium heavyweight cotton tee in Obsidian Black. Fade-resistant wash, perfect tailored casual styling.',
    isMadeInRwanda: false,
    isElectrical: false,
    tokenStandard: 'ERC-1155',
    contractAddress: '0xTs5bB...22b3',
    ipfsHash: 'ipfs://QmTsY...b844'
  },
  {
    id: '15',
    name: 'Kigali Classic Combed Tee (Kigali Orange)',
    category: "Men's Clothes",
    priceEth: 0.006,
    priceUsd: 19.80,
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=600',
    description: 'Vibrant Kigali Orange combed tee. Stand out with contrast side-seam stitching and screenprinted detail.',
    isMadeInRwanda: false,
    isElectrical: false,
    tokenStandard: 'ERC-1155',
    contractAddress: '0xTs5bB...33c4',
    ipfsHash: 'ipfs://QmTsY...o092'
  },
  {
    id: '16',
    name: 'Kigali Classic Combed Tee (Royal Blue)',
    category: "Men's Clothes",
    priceEth: 0.006,
    priceUsd: 19.80,
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=600',
    description: 'Deep Royal Blue cotton tee. Premium dye lock prevents bleeding, giving long-lasting color richness.',
    isMadeInRwanda: false,
    isElectrical: false,
    tokenStandard: 'ERC-1155',
    contractAddress: '0xTs5bB...44d5',
    ipfsHash: 'ipfs://QmTsY...r555'
  },
  {
    id: '17',
    name: 'Kigali Classic Combed Tee (Emerald Green)',
    category: "Men's Clothes",
    priceEth: 0.006,
    priceUsd: 19.80,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=600',
    description: 'Fresh Emerald Green styled shirt. Breathable knit structure suitable for year-round layering.',
    isMadeInRwanda: false,
    isElectrical: false,
    tokenStandard: 'ERC-1155',
    contractAddress: '0xTs5bB...55e6',
    ipfsHash: 'ipfs://QmTsY...g831'
  },
  {
    id: '18',
    name: 'Kigali Classic Combed Tee (Sunburst Yellow)',
    category: "Men's Clothes",
    priceEth: 0.006,
    priceUsd: 19.80,
    image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=600',
    description: 'Warm Sunburst Yellow cotton tee. Perfect casual style matching with jeans, jackets, or traditional wraps.',
    isMadeInRwanda: false,
    isElectrical: false,
    tokenStandard: 'ERC-1155',
    contractAddress: '0xTs5bB...66f7',
    ipfsHash: 'ipfs://QmTsY...y762'
  },
  /* --- Other Cultural Products of Rwanda --- */
  {
    id: '19',
    name: 'Handwoven Agaseke Peace Basket',
    category: 'Rwandan Culture',
    priceEth: 0.022,
    priceUsd: 72.60,
    image: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&q=80&w=600',
    description: 'Iconic pointed Agaseke basket hand-coiled with local sisal and sweetgrass. Symbolizes harmony, peace, and culture in Rwanda.',
    isMadeInRwanda: true,
    isElectrical: false,
    tokenStandard: 'ERC-1155',
    contractAddress: '0xCu9aA...22a1',
    ipfsHash: 'ipfs://QmCuX...b902'
  },
  {
    id: '20',
    name: 'Traditional Imigongo Geometric Art Panel',
    category: 'Rwandan Culture',
    priceEth: 0.032,
    priceUsd: 105.60,
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=600',
    description: 'Stunning geometric relief painting crafted using organic materials. Traditional colors and patterns representing Rwandan art.',
    isMadeInRwanda: true,
    isElectrical: false,
    tokenStandard: 'ERC-1155',
    contractAddress: '0xCu9aA...44b2',
    ipfsHash: 'ipfs://QmCuX...i092'
  },
  {
    id: '21',
    name: 'Ingabo Traditional Hand-Carved Shield',
    category: 'Rwandan Culture',
    priceEth: 0.045,
    priceUsd: 148.50,
    image: 'https://images.unsplash.com/photo-1607604276583-eefddd076aa5?auto=format&fit=crop&q=80&w=600',
    description: 'Miniature carved wooden ceremonial shield with classic black-and-white zig-zag details. Represents historical valor.',
    isMadeInRwanda: true,
    isElectrical: false,
    tokenStandard: 'ERC-1155',
    contractAddress: '0xCu9aA...77c3',
    ipfsHash: 'ipfs://QmCuX...s321'
  },
  {
    id: '22',
    name: 'Virunga Organic Specialty Tea Pack',
    category: 'Rwandan Culture',
    priceEth: 0.008,
    priceUsd: 26.40,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600',
    description: 'Grown on the rich volcanic soils bordering the Virunga mountain range. Rich, deep aroma, premium loose tea leaves.',
    isMadeInRwanda: true,
    isElectrical: false,
    tokenStandard: 'ERC-1155',
    contractAddress: '0xCu9aA...88d4',
    ipfsHash: 'ipfs://QmCuX...t999'
  }
];

export const Web3Provider = ({ children }) => {
  // Store state
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('km_products_v3');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('km_orders_v3');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('km_cart_v3');
    return saved ? JSON.parse(saved) : [];
  });

  // UI state
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('km_admin_auth') === 'true';
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [momoTimeouts, setMomoTimeouts] = useState([]);
  const [smsNotification, setSmsNotification] = useState(null);
  
  // Web3 state
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletType, setWalletType] = useState('');

  // Transaction simulator state
  const [txState, setTxState] = useState('idle'); // idle | signing | broadcasting | mining | confirmed | error
  const [txHash, setTxHash] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('crypto'); // 'crypto' | 'momo'
  const [momoNumber, setMomoNumber] = useState('');
  const [momoTxState, setMomoTxState] = useState('idle'); // idle | push_sent | awaiting_pin | verifying | confirmed | error

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('km_products_v3', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('km_orders_v3', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('km_cart_v3', JSON.stringify(cart));
  }, [cart]);

  // Wallet logic
  const connectWallet = (type) => {
    setIsWalletModalOpen(false);
    // Simulate Metamask/WalletConnect connection delay
    setTimeout(() => {
      const mockAddresses = {
        metaMask: '0x71C4B441C114811d14a44131b1107B57a6Df03E7',
        walletConnect: '0x992B28f3a3C78c1b2f67232DE673cCcB77c4B23c',
        coinbase: '0x5F11CbD9cCc92bA6a3F778841B1897cCcB77c4e5'
      };
      setWalletConnected(true);
      setWalletAddress(mockAddresses[type] || '0x71C4B441C114811d14a44131b1107B57a6Df03E7');
      setWalletBalance(3.482); // Simulated ETH balance
      setWalletType(type);
      showToast('Wallet successfully connected!');
    }, 1000);
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress('');
    setWalletBalance(0);
    setWalletType('');
    showToast('Wallet disconnected');
  };

  // Cart operations
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        showToast(`Increased quantity of ${product.name}`);
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      showToast(`${product.name} added to cart`);
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.id === productId);
      if (item) {
        showToast(`${item.name} removed`);
      }
      return prevCart.filter((item) => item.id !== productId);
    });
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Checkout with Mock Blockchain Transaction
  const checkoutWithCrypto = (location = 'Kigali') => {
    if (!walletConnected) {
      setIsWalletModalOpen(true);
      return;
    }
    if (cart.length === 0) return;

    setIsCartOpen(false);
    setIsTxModalOpen(true);
    setTxState('signing');

    let deliveryTime = '3 Hours';
    if (location === 'Outside Kigali') deliveryTime = '1 Day';
    else if (location === 'Outside Rwanda') deliveryTime = '2 Weeks';

    // Step 1: Request signature (delay 2s)
    setTimeout(() => {
      setTxState('broadcasting');

      // Step 2: Broadcast to Rwanda Devnet RPC Node (delay 2s)
      setTimeout(() => {
        setTxState('mining');
        const randomHash = '0x' + Array.from({ length: 64 }, () => 
          Math.floor(Math.random() * 16).toString(16)
        ).join('');
        setTxHash(randomHash);

        // Step 3: Mining block (delay 3s)
        setTimeout(() => {
          setTxState('confirmed');

          // Log order
          const totalEth = cart.reduce((sum, item) => sum + (item.priceEth * item.quantity), 0);
          const newOrder = {
            id: `KM-${Math.floor(1000 + Math.random() * 9000)}`,
            date: new Date().toLocaleString(),
            buyer: walletAddress,
            items: cart.map(item => `${item.name} (x${item.quantity})`),
            totalEth: parseFloat(totalEth.toFixed(4)),
            txHash: randomHash,
            location,
            deliveryTime,
            status: 'Confirmed'
          };
          setOrders(prev => [newOrder, ...prev]);
          clearCart();
          
          // Deduct balance
          setWalletBalance(prev => parseFloat((prev - totalEth).toFixed(4)));
        }, 3000);

      }, 2000);

    }, 2000);
  };

  // Product CRUD
  const addProduct = (newProduct) => {
    const id = `P-${Math.floor(1000 + Math.random() * 9000)}`;
    const product = {
      ...newProduct,
      id,
      priceEth: parseFloat(newProduct.priceEth),
      priceUsd: parseFloat(newProduct.priceEth) * 3300, // Fixed mock conversion rate
      tokenStandard: 'ERC-1155',
      contractAddress: '0xRw8bF...' + Math.floor(1000 + Math.random()*9000).toString(16),
      ipfsHash: 'ipfs://Qm' + Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    };
    setProducts(prev => [product, ...prev]);
    showToast('Product added successfully!');
  };

  const updateProduct = (updatedProduct) => {
    setProducts(prev =>
      prev.map(p => p.id === updatedProduct.id ? {
        ...updatedProduct,
        priceEth: parseFloat(updatedProduct.priceEth),
        priceUsd: parseFloat(updatedProduct.priceEth) * 3300
      } : p)
    );
    showToast('Product updated successfully!');
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product removed');
  };

  // Global Toast Handler
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const loginAdmin = (username, password) => {
    if (username === 'Epa' && password === 'Epa123') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('km_admin_auth', 'true');
      setIsAdminMode(true);
      setIsLoginModalOpen(false);
      showToast('Welcome Epa! Admin access authorized.');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('km_admin_auth');
    setIsAdminMode(false);
    showToast('Admin session terminated.');
  };

  const checkoutWithMomo = (phone, location = 'Kigali') => {
    if (cart.length === 0) return;
    setMomoNumber(phone);
    setPaymentMethod('momo');
    setIsCartOpen(false);
    setIsTxModalOpen(true);
    setMomoTxState('push_sent');

    const timeouts = [];

    let deliveryTime = '3 Hours';
    if (location === 'Outside Kigali') deliveryTime = '1 Day';
    else if (location === 'Outside Rwanda') deliveryTime = '2 Weeks';

    // Step 1: Initiating request -> Awaiting Handset PIN
    const t1 = setTimeout(() => {
      setMomoTxState('awaiting_pin');

      // Step 2: Awaiting PIN -> Verifying Network
      const t2 = setTimeout(() => {
        setMomoTxState('verifying');

        // Step 3: Verifying -> Confirmed
        const t3 = setTimeout(() => {
          setMomoTxState('confirmed');

          const totalEth = cart.reduce((sum, item) => sum + (item.priceEth * item.quantity), 0);
          const totalUsd = totalEth * 3300;
          const totalRwf = Math.round(totalUsd * 1320);
          const mockMomoTxId = 'MTN-' + Math.floor(100000000 + Math.random() * 900000000);
          
          const newOrder = {
            id: `KM-${Math.floor(1000 + Math.random() * 9000)}`,
            date: new Date().toLocaleString(),
            buyer: `Momo (${phone})`,
            items: cart.map(item => `${item.name} (x${item.quantity})`),
            totalEth: parseFloat(totalEth.toFixed(4)),
            txHash: mockMomoTxId,
            location,
            deliveryTime,
            status: 'Confirmed'
          };
          setOrders(prev => [newOrder, ...prev]);
          clearCart();

          // Generate simulated SMS receipt message
          const smsText = `Y'ello! You have received payment of ${totalRwf.toLocaleString()} FRw from customer ${phone} for Order ${newOrder.id}. TxID: ${mockMomoTxId}. Your mobile money balance is updated.`;
          setSmsNotification({
            phone: '+250782148861',
            message: smsText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        }, 2000);
        timeouts.push(t3);

      }, 5000); // 5 seconds to allow user to simulate decline
      timeouts.push(t2);

    }, 2000);
    timeouts.push(t1);

    setMomoTimeouts(timeouts);
  };

  const cancelMomoCheckout = () => {
    momoTimeouts.forEach(t => clearTimeout(t));
    setMomoTimeouts([]);
    setMomoTxState('error');
    showToast('MTN Momo transaction process not completed.');
  };

  const cancelCryptoCheckout = () => {
    setTxState('error');
    showToast('Crypto checkout transaction process not completed.');
  };

  return (
    <Web3Context.Provider
      value={{
        products,
        cart,
        orders,
        isAdminMode,
        setIsAdminMode,
        isCartOpen,
        setIsCartOpen,
        isWalletModalOpen,
        setIsWalletModalOpen,
        isTxModalOpen,
        setIsTxModalOpen,
        isAdminAuthenticated,
        isLoginModalOpen,
        setIsLoginModalOpen,
        loginAdmin,
        logoutAdmin,
        paymentMethod,
        setPaymentMethod,
        momoNumber,
        setMomoNumber,
        momoTxState,
        setMomoTxState,
        checkoutWithMomo,
        cancelMomoCheckout,
        cancelCryptoCheckout,
        smsNotification,
        setSmsNotification,
        walletConnected,
        walletAddress,
        walletBalance,
        walletType,
        txState,
        txHash,
        setTxState,
        connectWallet,
        disconnectWallet,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        checkoutWithCrypto,
        addProduct,
        updateProduct,
        deleteProduct,
        toastMessage,
        showToast
      }}
    >
      {children}
      {toastMessage && (
        <div className="toast">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
