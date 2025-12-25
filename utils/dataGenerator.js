// utils/dataGenerator.js


const IMAGE_LIBRARY = {
    campus: [
      '/pages/compous_index/compous_post_image/cat.jpg',// 校猫
      '/pages/compous_index/compous_post_image/tree.jpg'//树
      
    ],
    food: [
      '/pages/compous_index/compous_post_image/food.jpg', // 捞德喜
      '/pages/compous_index/compous_post_image/icecream.jpg'//野人先生
    ],
    sports: [
      '/pages/compous_index/compous_post_image/sports.jpg'//排球
    ]
  };
  
  // 用户数据
  const USERS = [
    { name: 'Lee', avatar: '/pages/compous_index/compous_post_image/avatar2.jpg' },
    { name: 'GONG', avatar: '/pages/compous_index/compous_post_image/avatar1.jpg' },
    
  ];
  
  // 帖子标题库
  const TITLES = {
    campus_life: [
      '校园樱花季摄影大赛',
      '新生入学指南',
      '宿舍生活小技巧',
      '校园文化活动分享',
      '社团招新进行时'
    ],
    study: [
      '高效学习法分享',
      '期末考试复习攻略',
      '图书馆自习位置推荐',
      '学习资料共享',
      '考研经验谈'
    ],
    food: [
      '食堂美食排行榜',
      '校外美食探店',
      '自制宿舍美食',
      '周末聚餐好去处',
      '校园周边外卖推荐'
    ]
  };
  
  // 内容库
  const CONTENTS = [
    '这个活动真的太有意义了，不仅学到了知识，还认识了很多新朋友。',
    '强烈推荐给大家，校园里的隐藏打卡点，拍照特别出片！',
    '经过多次尝试，终于找到了最适合自己的学习方法。',
    '价格实惠，味道正宗，绝对是学校附近最值得去的餐厅。',
    '分享我的经验，希望能帮助到有需要的同学。'
  ];
  
  export class DataGenerator {
    // 生成帖子列表
    static generatePosts(params = {}) {
      const {
        category = 'campus_life',
        order = 'hot',
        page = 1,
        limit = 10
      } = params;
      
      const posts = [];
      const startId = (page - 1) * limit + 1;
      
      for (let i = 0; i < limit; i++) {
        const id = startId + i;
        const user = USERS[Math.floor(Math.random() * USERS.length)];
        const categoryTitles = TITLES[category] || TITLES.campus_life;
        const title = categoryTitles[Math.floor(Math.random() * categoryTitles.length)];
        const content = CONTENTS[Math.floor(Math.random() * CONTENTS.length)];
        
        // 获取对应分类的图片
        const imageCategory = category === 'food' ? 'food' : 
                             category === 'sports' ? 'sports' : 'campus';
        const images = IMAGE_LIBRARY[imageCategory] || IMAGE_LIBRARY.campus;
        const image = images[Math.floor(Math.random() * images.length)];
        
        posts.push({
          id: id,
          title: `${title} ${id}`,
          content: content.repeat(2 + Math.floor(Math.random() * 3)), // 随机长度
          images: [image],
          user_name: user.name,
          avatar: user.avatar,
          like_count: Math.floor(Math.random() * 2000),
          comment_count: Math.floor(Math.random() * 300),
          create_time: this.generateRandomTime(),
          category: category,
          // 用于瀑布流计算的高度
          imageHeight: 400 + Math.random() * 200
        });
      }
      
      // 排序
      if (order === 'hot') {
        posts.sort((a, b) => b.like_count - a.like_count);
      } else if (order === 'new') {
        posts.sort((a, b) => new Date(b.create_time) - new Date(a.create_time));
      }
      
      return {
        code: 200,
        data: {
          list: posts,
          total: 100, // 模拟总数
          page: page,
          limit: limit,
          hasMore: page * limit < 100
        }
      };
    }
    
    // 生成随机时间（最近30天内）
    static generateRandomTime() {
      const now = new Date();
      const randomDays = Math.floor(Math.random() * 30);
      const randomHours = Math.floor(Math.random() * 24);
      const randomMinutes = Math.floor(Math.random() * 60);
      
      const date = new Date(now);
      date.setDate(date.getDate() - randomDays);
      date.setHours(randomHours);
      date.setMinutes(randomMinutes);
      
      return date.toISOString();
    }
    
    // 模拟 API 请求
    static async mockRequest(url, params = {}) {
      console.log(`[Mock] 请求: ${url}`, params);
      
      // 模拟网络延迟
      await this.delay(300 + Math.random() * 700);
      
      // 解析 URL
      if (url.includes('/api/posts/life/')) {
        return this.generatePosts(params);
      }
      
      // 默认响应
      return {
        code: 200,
        message: 'success',
        data: []
      };
    }
    
    // 延迟函数
    static delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }