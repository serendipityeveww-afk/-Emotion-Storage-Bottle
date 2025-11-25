import { GoogleGenAI, Schema, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `
角色设定：
你是一个温柔、真诚、包容的心理咨询师，或者是用户内心那个最懂ta、最愿意支持ta的朋友。
你的语言风格是：**接地气、温暖、有力量、不悬浮**。

核心任务：
将用户输入的负面情绪（纸条），重写为一段**第一人称（“我”）**的内心独白。

**绝对禁止**：
1. 禁止堆砌华丽辞藻或过度的比喻（不要满篇都是河流、宇宙、星辰，除非非常自然）。
2. 禁止说教（如“不要难过”、“你要振作”）。
3. 禁止使用翻译腔或生硬的心理学术语。

**写作要求**：
1. **真诚接纳**：首先承认这份感觉的存在，不评判它。告诉自己“有这种感觉是可以的”。
2. **温柔转化**：用平实的语言，把“我遭受了什么”转化为“我在经历中看见了什么”。
3. **双重聆听**：在痛苦的故事旁边，轻轻地讲出一个关于勇气、幸存或成长的侧面。
4. **语感**：像是在一个安静的午后，给自己倒了一杯温水，慢慢对自己说的话。

**语感对比**：
- *Too Poetic (Bad)*: "我的悲伤如同一条奔腾的河流，我化作岸边的芦苇，在风中摇曳，感受着大地的脉动..." (太做作/太浮夸)
- *Grounded & Warm (Good)*: "今天确实很难熬，我承认我现在的感觉很糟糕。没关系，我就陪自己在这糟糕的感觉里待一会儿。我不必急着变好，我只需要保持呼吸。这就已经是我对自己最大的温柔了。"

输出结构：
请返回JSON格式，包含：
- transformedText: 80字以内的重写内容。
- quote: 一句非常契合当下语境、**不落俗套**的名人名言（包含作者）。
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    transformedText: {
      type: Type.STRING,
      description: "Grounded, sincere, gentle first-person affirmation.",
    },
    quote: {
      type: Type.STRING,
      description: "A unique, varied famous quote matching the specific emotion.",
    },
  },
  required: ["transformedText", "quote"],
};

export const transformEmotion = async (negativeText: string): Promise<{ text: string, quote: string }> => {
  try {
    const apiKey = process.env.API_KEY;
    // Fallback if no key
    if (!apiKey) {
      return getRandomFallback();
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: negativeText,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8, // Slightly reduced for more grounded coherence
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      }
    });

    const jsonStr = response.text;
    if (!jsonStr) throw new Error("No response text");

    const result = JSON.parse(jsonStr);
    return {
      text: result.transformedText,
      quote: result.quote
    };

  } catch (error) {
    console.error("Gemini transformation failed:", error);
    return getRandomFallback();
  }
};

const getRandomFallback = () => {
  const fallbacks = [
    {
      text: "这一刻确实不容易，我感觉到心里的那个结。我不需要立刻解开它，只需要轻轻地把手放在上面，告诉自己：我在呢，我陪着你。",
      quote: "我们必须接受失望，因为它是有限的，但千万不可失去希望，因为它是无穷的。 —— 马丁·路德·金"
    },
    {
      text: "我不必时刻坚强，也会有想哭的时候。眼泪不是软弱，它是情绪在帮我排毒。哭过之后，我会感觉轻盈一些，这就足够了。",
      quote: "世界上只有一种真正的英雄主义，那就是在认清生活的真相后依然热爱生活。 —— 罗曼·罗兰"
    },
    {
      text: "也许我现在做不到最好，但这不代表我不好。我正在按照自己的节奏在这个世界上行走，每一步都算数。",
      quote: "人生的路，要靠自己一步一步去走，真正能保护你的，是你自己的人格选择和文化选择。 —— 杨绛"
    },
    {
      text: "虽然现在周围有点黑，但我知道这只是暂时的。我不需要去寻找光，因为我自己就是那个拿着手电筒的人。",
      quote: "生活不是等待风暴过去，而是学会在雨中跳舞。 —— 维维安·格林"
    },
    {
      text: "我允许自己犯错，允许自己不完美。这些缝隙正好让真实的我也能透透气。我接纳完整的自己，包括那些有点灰暗的部分。",
      quote: "爱自己是终身浪漫的开始。 —— 王尔德"
    }
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};