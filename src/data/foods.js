// Approximate values per standard serving. Each pool has 10 dishes so a
// 7-day plan never repeats and there are spares for "swap".
// [id, name, emoji, kcal, protein, carbs, fat, portion]

const make = (rows) =>
  rows.map(([id, name, emoji, kcal, protein, carbs, fat, portion]) => ({
    id, name, emoji, kcal, protein, carbs, fat, portion,
  }));

export const FOODS = {
  veg: {
    breakfast: make([
      ['vb1', 'Vegetable Poha with Peanuts', '🍚', 250, 6, 45, 5, '1 plate (200 g)'],
      ['vb2', 'Moong Dal Chilla & Mint Chutney', '🥞', 240, 14, 30, 6, '2 chillas'],
      ['vb3', 'Vegetable Oats Upma', '🥣', 230, 8, 38, 5, '1 bowl'],
      ['vb4', 'Ragi Dosa with Sambar', '🫓', 260, 8, 44, 5, '2 dosas + 1 cup sambar'],
      ['vb5', 'Greek Yogurt Berry Bowl', '🫐', 220, 15, 28, 5, '1 bowl (200 g)'],
      ['vb6', 'Steamed Idli with Sambar', '🍙', 270, 10, 50, 3, '3 idlis + sambar'],
      ['vb7', 'Besan Vegetable Cheela', '🥙', 250, 12, 28, 9, '2 cheelas'],
      ['vb8', 'Paneer Bhurji & Multigrain Toast', '🧀', 290, 18, 22, 14, '100 g + 1 toast'],
      ['vb9', 'Overnight Oats, Chia & Apple', '🍎', 260, 10, 40, 7, '1 jar'],
      ['vb10', 'Sprouts Salad with Lemon', '🌱', 200, 12, 30, 3, '1 large bowl'],
    ]),
    lunch: make([
      ['vl1', 'Brown Rice, Dal Tadka & Salad', '🍛', 420, 16, 68, 8, '1 cup rice + 1 cup dal'],
      ['vl2', 'Phulka, Palak Paneer & Salad', '🥬', 450, 22, 46, 18, '2 phulka + 1 cup'],
      ['vl3', 'Rajma with Jeera Rice', '🫘', 430, 17, 70, 7, '1 cup each'],
      ['vl4', 'Quinoa Veg Pulao & Raita', '🥗', 400, 15, 60, 10, '1.5 cups + raita'],
      ['vl5', 'Jowar Roti, Mixed Veg & Curd', '🫓', 410, 14, 62, 11, '2 roti + 1 cup'],
      ['vl6', 'Chole with Roti & Onion Salad', '🧆', 440, 18, 64, 11, '1 cup + 1 roti'],
      ['vl7', 'Millet Khichdi with Kadhi', '🍲', 400, 14, 62, 9, '1.5 cups'],
      ['vl8', 'Tofu Stir-fry with Brown Rice', '🥢', 420, 22, 56, 12, '150 g tofu + rice'],
      ['vl9', 'Lemon Rice, Sambar & Beans Poriyal', '🍋', 430, 13, 70, 10, '1 plate'],
      ['vl10', 'Soya Chunk Curry with Phulka', '🍛', 420, 28, 50, 10, '1 cup + 2 phulka'],
    ]),
    snack: make([
      ['vs1', 'Roasted Makhana', '🍿', 120, 4, 20, 3, '1 cup'],
      ['vs2', 'Apple with Peanut Butter', '🍏', 180, 4, 26, 8, '1 apple + 1 tbsp'],
      ['vs3', 'Roasted Chana', '🥜', 140, 8, 20, 3, '30 g'],
      ['vs4', 'Buttermilk & Almonds', '🥛', 150, 6, 8, 10, '1 glass + 8 almonds'],
      ['vs5', 'Fresh Fruit Chaat', '🍉', 120, 2, 28, 1, '1 bowl'],
      ['vs6', 'Cucumber Sticks & Hummus', '🥒', 140, 5, 14, 7, '1 cup + 2 tbsp'],
      ['vs7', 'Sprouts Bhel', '🥗', 150, 8, 24, 2, '1 bowl'],
      ['vs8', 'Green Tea & Oat Biscuits', '🍵', 130, 2, 20, 5, '1 cup + 2 biscuits'],
      ['vs9', 'Paneer Tikka Bites', '🍢', 160, 10, 4, 11, '50 g'],
      ['vs10', 'Masala Sweet Corn Cup', '🌽', 140, 4, 28, 2, '1 cup'],
    ]),
    dinner: make([
      ['vd1', 'Clear Veg Soup & Paneer Salad', '🥣', 330, 18, 20, 18, '1 bowl + salad'],
      ['vd2', 'Moong Dal Khichdi with Curd', '🍲', 350, 15, 56, 7, '1.5 cups'],
      ['vd3', 'Multigrain Roti & Lauki Chana Dal', '🫓', 360, 15, 52, 9, '2 roti + 1 cup'],
      ['vd4', 'Grilled Tofu & Sautéed Veggies', '🥦', 320, 22, 18, 16, '150 g tofu'],
      ['vd5', 'Vegetable Oats Khichdi', '🥘', 330, 12, 52, 7, '1.5 cups'],
      ['vd6', 'Palak Dal with Bajra Roti', '🥬', 340, 16, 46, 9, '1 cup + 1 roti'],
      ['vd7', 'Mushroom Peas Curry & Roti', '🍄', 330, 13, 42, 11, '1 cup + 1 roti'],
      ['vd8', 'Stuffed Besan Cheela & Salad', '🥙', 340, 16, 36, 13, '2 cheelas'],
      ['vd9', 'Quinoa Chickpea Salad Bowl', '🥗', 350, 15, 50, 10, '1 large bowl'],
      ['vd10', 'Vegetable Daliya Pulao & Raita', '🍚', 340, 12, 56, 7, '1.5 cups'],
    ]),
  },
  nonveg: {
    breakfast: make([
      ['nb1', 'Masala Omelette & Multigrain Toast', '🍳', 300, 18, 16, 17, '2 eggs + 1 toast'],
      ['nb2', 'Boiled Eggs & Seasonal Fruit', '🥚', 280, 19, 20, 14, '3 eggs + 1 fruit'],
      ['nb3', 'Egg Bhurji with Roti', '🫓', 310, 18, 24, 15, '2 eggs + 1 roti'],
      ['nb4', 'Whole-wheat Chicken Sandwich', '🥪', 320, 26, 32, 9, '1 sandwich'],
      ['nb5', 'Egg White Scramble & Oats', '🥣', 270, 22, 30, 5, '4 whites + ½ cup oats'],
      ['nb6', 'Egg Dosa with Coconut Chutney', '🥞', 300, 14, 38, 10, '2 dosas'],
      ['nb7', 'Chicken & Avocado Toast', '🥑', 330, 24, 26, 14, '2 slices'],
      ['nb8', 'Egg & Spinach Wrap', '🌯', 300, 18, 30, 12, '1 wrap'],
      ['nb9', 'Poached Eggs on Sourdough', '🍞', 290, 16, 28, 12, '2 eggs + 1 slice'],
      ['nb10', 'Chicken Keema Paratha & Curd', '🫓', 340, 24, 34, 12, '1 small paratha'],
    ]),
    lunch: make([
      ['nl1', 'Grilled Chicken, Brown Rice & Salad', '🍗', 460, 38, 50, 10, '120 g chicken'],
      ['nl2', 'Fish Curry with Red Rice', '🐟', 450, 32, 55, 11, '1 cup each'],
      ['nl3', 'Home-style Chicken Curry & Phulka', '🍛', 470, 34, 44, 16, '1 cup + 2 phulka'],
      ['nl4', 'Egg Curry with Jeera Rice', '🥚', 440, 20, 58, 14, '2 eggs + 1 cup rice'],
      ['nl5', 'Tandoori Chicken & Quinoa Salad', '🥗', 450, 40, 40, 13, '2 pcs + 1 bowl'],
      ['nl6', 'Prawn Pulao & Cucumber Raita', '🦐', 440, 28, 58, 10, '1.5 cups'],
      ['nl7', 'Chicken Biryani (light) & Raita', '🍚', 480, 30, 60, 13, '1.5 cups'],
      ['nl8', 'Grilled Fish Tacos', '🌮', 430, 30, 44, 14, '2 tacos'],
      ['nl9', 'Chicken Keema with Roti', '🫓', 470, 32, 46, 16, '1 cup + 2 roti'],
      ['nl10', 'Lemon Pepper Chicken & Millet', '🍋', 450, 36, 48, 11, '120 g + 1 cup'],
    ]),
    snack: make([
      ['ns1', 'Boiled Eggs with Pepper', '🥚', 140, 12, 1, 10, '2 eggs'],
      ['ns2', 'Chicken Tikka Bites', '🍢', 170, 22, 3, 7, '4 pieces'],
      ['ns3', 'Tuna Cucumber Cups', '🥒', 130, 16, 4, 5, '6 cups'],
      ['ns4', 'Veggie Egg Muffins', '🧁', 160, 12, 4, 10, '2 muffins'],
      ['ns5', 'Chicken Clear Soup', '🍜', 120, 14, 6, 4, '1 bowl'],
      ['ns6', 'Baked Fish Fingers', '🐠', 180, 16, 14, 6, '4 pieces'],
      ['ns7', 'Chicken Seekh Kebab', '🍡', 180, 18, 5, 9, '2 kebabs'],
      ['ns8', 'Egg Salad Lettuce Wrap', '🥬', 150, 10, 4, 10, '2 wraps'],
      ['ns9', 'Garlic Prawn Skewers', '🦐', 140, 20, 3, 5, '2 skewers'],
      ['ns10', 'Chicken Ham Roll-ups', '🌯', 130, 14, 3, 6, '4 rolls'],
    ]),
    dinner: make([
      ['nd1', 'Grilled Salmon & Steamed Veggies', '🐟', 380, 34, 12, 22, '120 g fillet'],
      ['nd2', 'Chicken Soup & Sautéed Veggies', '🍲', 320, 30, 20, 12, '1 large bowl'],
      ['nd3', 'Egg White Omelette, Salad & Roti', '🍳', 300, 24, 28, 8, '4 whites + 1 roti'],
      ['nd4', 'Tandoori Fish with Mint Salad', '🐠', 330, 34, 10, 16, '150 g fish'],
      ['nd5', 'Chicken & Veggie Stir-fry', '🥢', 350, 32, 18, 15, '1 large plate'],
      ['nd6', 'Egg Curry with Roti', '🥚', 360, 18, 30, 18, '2 eggs + 1 roti'],
      ['nd7', 'Lemon Garlic Prawns & Quinoa', '🦐', 350, 30, 32, 10, '120 g + ½ cup'],
      ['nd8', 'Chicken Tikka Salad Bowl', '🥗', 340, 34, 16, 15, '1 large bowl'],
      ['nd9', 'Kerala Fish Stew with Appam', '🍛', 360, 28, 34, 12, '1 cup + 1 appam'],
      ['nd10', 'Grilled Chicken Lettuce Wraps', '🌯', 330, 32, 18, 13, '3 wraps'],
    ]),
  },
};

const INDEX = Object.fromEntries(
  Object.values(FOODS).flatMap((meals) => Object.values(meals).flat()).map((f) => [f.id, f]),
);

export const getFood = (id) => INDEX[id];
