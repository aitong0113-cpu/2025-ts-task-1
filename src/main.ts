// --------------------------- 題目一：變數宣告型別定義 ------------------------------
// 說明：請為以下變數補上正確型別（數字、字串、布林、字串陣列、帶型別的物件）。
// 目標：能直接通過型別檢查與基本值檢查。

export const plantId /* TODO: 型別 */ :number = 101;
export const plantName /* TODO: 型別 */ :string = "琴葉榕（Fiddle Leaf Fig）";
export const isAvailable /* TODO: 型別 */ :boolean = true;
export const tags /* TODO: 型別(字串陣列) */ :string[] = ["大型植栽", "室內明亮散射光"];
export const plant /* TODO: 物件型別 */ :{ id:number; name:string; price:number }= { id: 101, name: "琴葉榕", price: 2500 };
export const cart /* TODO: 陣列包物件的型別定義 >cart → 陣列，每個元素是物件 */ :{ sku:string;name:string;qty:number;price:number;potColor?:string; }[ ]= [
  { sku: "PLANT-1001", name: "虎尾蘭", qty: 2, price: 480 },
  { sku: "PLANT-2001", name: "龜背芋", qty: 1, price: 1200, potColor: "白" },
];/*→ potColor 並不是每個物件都有，所以用 ?: 可選欄位。*/



// --------------------------- 題目二：Enum（定義 & 反向映射--------------------------- 
// 說明：請定義 PlantCategory Enum，並示範反向映射。
// 目標：理解 Enum 定義與反向映射的寫法。 Enum 是「列舉型別」，用來建立一組固定不會變的分類名稱，只要打錯字或非定義分類的就會報錯

export enum PlantCategory { //定義一個叫做 PlantCategory 植物分類 的 enum
  LargePlant, //Enum 會自動從 0 開始編號 >>0
  MediumPlant, //1
  SmallPlant, //2
}
//反向映射就是：用 Enum 的數字，反查回 key 的名字。(Enum 在 TypeScript 裡同時支援「正向映射」跟「反向映射」。但只有 數字 Enum 才有「反向映射」)
export const catKeyName: string = PlantCategory[/* TODO: 取得 LargePlant 的數值 */ PlantCategory.LargePlant ];




// ------------------------------ 題目三：type（& 組合）------------------------------ 
// 說明：請用 type 定義 BasicPlant 與 StockInfo，再用 & 組合為 OnShelfPlant，建立範例變數。
// 目標：理解 type 宣告與交叉型別的寫法。

export type BasicPlant = /* TODO: { id: 型別; name: 型別; price: 型別 } */ {
  id: number;
  name: string;
  price: number;
};
export type StockInfo = /* TODO: { sku: 型別; quantity: 型別 } */ {
  sku:string;
  quantity:number;
};
export type OnShelfPlant = /* TODO: BasicPlant, StockInfo 組合 */ BasicPlant & StockInfo;//不需要寫 {}，因為 type 已經定義好了

export const snakePlant /* TODO: OnShelfPlant */ :OnShelfPlant = {
  id: 2,
  name: "虎尾蘭",
  price: 480,
  sku: "PLANT-1001",
  quantity: 42,
};



// ------------------------------  題目四：interface（extends 組合） ------------------------------
// 說明：定義 Price 與 Shippable，PlantItem 需 extends 兩者並包含 id/name。
// 目標：理解介面擴充多重介面的寫法。

//// 定義價格資訊介面 Price
// → 商品一定會有 price 與 currency（限定只能是 "TWD" 或 "USD"）
export interface Price { /* TODO: price: 型別; currency:"TWD"|"USD" */   
  price: number;
  currency: "TWD" | "USD";  // 只能是 TWD 或 USD 
} //	•	interface 是「獨立結構定義」→ 標準寫法結尾不加分號

// 定義運送資訊介面 Shippable
// → 商品一定要知道重量與出貨地點
export interface Shippable { /* TODO: weightKg: 型別; shipFrom: 型別 */ 
  weightKg: number;
  shipFrom: string;
}

// export interface PlantItem 組合 Price, Shippable 並包含 id/name
// PlantItem 需要：
// 1. 繼承 Price（取得 price, currency）
// 2. 繼承 Shippable（取得 weightKg, shipFrom）
// 3. 自己再加上 id 與 name 欄位
// → 這就是「多重繼承（extends Price, Shippable）」
export interface PlantItem extends Price, Shippable {
  id: number;
  name: string;
}

// fiddleLeafFig 套用 PlantItem 型別
// → 必須有 id/name + Price 裡的 price/currency + Shippable 裡的 weightKg/shipFrom
export const fiddleLeafFig /* TODO: PlantItem */ :PlantItem = {
  id: 101,
  name: "琴葉榕",
  price: 2500,
  currency: "TWD",
  weightKg: 8.2,
  shipFrom: "Taipei",
};



// ------------------------------  題目五：函式定義（以 type 標註參數與回傳） ------------------------------
// 說明：定義 CalcTotalFn，計算 items 小計，若有 coupon 則折抵（percent/cash）。
// 目標：以 type 定義函式型別並實作。

//(items 是 CartItem[],
export type CartItem = { price: number; qty: number };
// coupon 可以有兩種類型 percent/cash 
export type Coupon = { type: "percent" | "cash"; amount: number };
// (items 是 CartItem[], coupon 可以有也可以沒有) → 最後算出一個數字
export type CalcTotalFn = /* TODO: (參數型別) => 型別 */ (items: CartItem[], coupon?: Coupon) => number;
// calcTotal 使用 CalcTotalFn 這個型別
export const calcTotal /* TODO: CalcTotalFn */ :CalcTotalFn = (items, coupon) => {
  //.reduce使items一定是陣列，且陣列裡裝的是有 price 和 qty 的物件（上面 CartItem就如此定義）
  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0); 
  if (!coupon) return subtotal;//coupon 本身可以不存在
  // 百分比折扣
  if (coupon.type === "percent") 
    return Math.max(0, Math.round(subtotal * (1 - coupon.amount / 100)));
  // 現金折扣
  return Math.max(0, subtotal - coupon.amount);
};




// ------------------------------  題目六：Generics + API 應用（使用 axios)  ------------------------------
// 說明：import axios 與 AxiosResponse，定義 PlantDTO，實作 fetchPlants。
// API: https://fakestoreapi.com/products
// 目標：理解泛型定義與應用。

/*axios 是預設匯出（default export）——代表整個模組的主要功能。
AxiosResponse 是具名匯出（named export）——代表模組裡提供的 TypeScript 型別。
因此需要一起 import：前者不用大括號，後者要用大括號*/
import axios,{type AxiosResponse} from 'axios'; /* TODO */

export type PlantDTO = { 
  id: number; 
  title: string; 
  price: number; 
  category: string; 
};
// fetchPlants 回傳 Promise<AxiosResponse<PlantDTO[]>>
export const fetchPlants = async () /* TODO */ :Promise < AxiosResponse<PlantDTO[]> > => {
  return axios.get<PlantDTO[]> ('https://fakestoreapi.com/products');
}//這個 API 會回傳 PlantDTO 陣列，請用 PlantDTO[] 當作 axios.get 的泛型




// ------------------------------  題目七：Required、Partial ------------------------------
// 說明：updatePlant(input) 接受部分更新，實際回傳需是 Required<PlantBase>。
// 目標：掌握 Partial/Required 的互補與回傳保證。

//基礎型別 (description可選)
export type PlantBase = { 
  id: number; 
  name: string; 
  price: number; 
  description?: string 
};

// input：部分更新 → 用 Partial<PlantBase> ：把 PlantBase 每一個欄位都變可選
// 回傳：完整回傳 → Required<PlantBase>：把 T 裡「所有欄位」都變成必填的
export function updatePlant(input : Partial<PlantBase>/* TODO */ 
                           ): Required<PlantBase> { /* TODO */ 
  // existing：資料庫裡欄位必須全部存在 → Required<PlantBase>
  const existing /* TODO */ : Required<PlantBase>  = { 
    id: 1, 
    name: "虎尾蘭", 
    price: 480, 
    description: "耐陰、淨化空氣" 
  };
  
  // 合併舊資料 + 更新資料
  const merged = { ...existing, ...input };
  // 回傳一定要是完整版本
  return {
    id: merged.id,
    name: merged.name,
    price: merged.price,
    description: merged.description ?? "",
  };
}



// ------------------------------  題目八：Record ------------------------------
// 說明：用 Record 表示庫存表。是一種「用來做 表格/對照表/字典 的型別工具。用字串當 key，用數字當值 → 就很適合拿來表示庫存。
// 目標：以字串鍵對應到嚴格結構。

// key 是字串、value 是數字（庫存量）
export type Inventory = /* TODO */ Record<string, number>;
export const inventory /* TODO */ :Inventory  = {
  "PLANT-1001": 42,
  "PLANT-2001": 8,
};



// ------------------------------  題目九：Pick、Omit ------------------------------
// 說明：type PlantItem 由第四題定義，請用 Pick/Omit 建立兩個新型別。
// 目標：理解 Pick/Omit 的用法與差異。
// 需求：
// 1) CartPlant：只需 id/name/price
// 2) PublicPlant：移除重量與出貨地

// 只挑出 id / name / price
export type CartPlant = /* TODO */ Pick<PlantItem, "id" | "name" | "price"> ;
// 移除 weightKg / shipFrom，保留其他欄位
export type PublicPlant = /* TODO */ Omit<PlantItem, "weightKg" | "shipFrom">;

// 範例變數
//宣告變數 cartPlant，:CartPlant變數的結構必須符合CartPlant型別，TS會做型別檢查
export const cartPlant /* TODO */ :CartPlant  = { id: 101, name: "琴葉榕", price: 2500 };
export const publicPlant /* TODO */ :PublicPlant = { id: 101, name: "琴葉榕", price: 2500, currency: "TWD" };





// ------------------------------  題目十：綜合練習 ------------------------------
// 說明：這是一個後台新增商品的功能，請將以下需求用 TypeScript 實作。
/* 1️⃣ 定義 type Product
    產品資料結構如下：
    - id: 字串
    - title: 字串
    - category: 字串
    - description: 字串
    - origin_price: 數字
    - price: 數字
    - is_enabled: 布林
    - unit: 字串 
    - imageUrl: 字串
    - imagesUrl: 字串陣列（非必要）
*/

export type Product = {
  id: string;
  title: string;
  category: string;
  description: string;
  origin_price: number;
  price: number;
  is_enabled: boolean;
  unit: string;
  imageUrl: string;
  imagesUrl?: string[]; // ?代表非必要
};

/*
2️⃣ 定義 type CreateProduct
由 Product 衍生，但不包含 id（使用 Omit 刪欄位）
*/
// 建立商品 → 不需要 id
export type CreateProduct = Omit<Product, "id">;


/*
3️⃣ 定義 type UpdateProduct
由 Product 衍生，id, title 必須有，其餘皆可選（使用 Partial必填 與 Omit刪除 ）
*/
// 更新商品 → id / title 必填，其餘可選
// 步驟：
// 1. Omit<Product, "id" | "title"> → 把它們先移除
// 2. Partial<...> → 讓剩下的全部變可選
// 3. 再把 id, title 加回來（必填）
export type UpdateProduct = {
  id: string;
  title: string;
} & Partial<Omit<Product, "id" | "title">>;


/*
4️⃣ 實作函式 submitProduct(type, product)
參數說明：
- type 僅能是 "create" 或 "update"
- 若 type === "create"，參數型別應為 CreateProduct
- 若 type === "update"，參數型別應為 UpdateProduct
函式回傳字串：
create → "新增商品成功：${product.title}"
update → "更新商品成功：${product.id}"
*/
// submitProduct 這個函式負責：
// 根據 type（create or update），處理不同型別的商品資料
// 並回傳不同的成功訊息
export function submitProduct(
  // type 參數：只能是 "create" 或 "update"
  type: "create" | "update",

  // product 參數：可能是 CreateProduct（新增）或 UpdateProduct（更新）
  // → 使用 Union Type 讓 TS 在執行時透過 type 判斷實際型別
  product: CreateProduct | UpdateProduct
): string { // 整個函式的回傳型別：string（根據題目要求）

  // 判斷是否為「新增商品」
  // 若 type === "create"，TS 會自動把 product「窄化」成 CreateProduct 型別
  if (type === "create") {
    // CreateProduct 不包含 id，但一定包含 title
    // 題目要求回傳："新增商品成功：${product.title}"
    return `新增商品成功：${product.title}`;
  }
    // 型別縮小：確保 product 一定是 UpdateProduct
  if ("id" in product) {
    return `更新商品成功：${product.id}`;
  }

  // 否則型別一定是 "update"
  // TS 在這裡會自動把 product 判定成 UpdateProduct（因為 id 在這型別是必填）
  // 題目要求回傳："更新商品成功：${product.id}"
   // 理論上永遠不會到這，但加一下讓 TS 滿意
  return "未知操作";
}
