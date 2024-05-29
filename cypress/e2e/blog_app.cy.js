// 但是，Mocha 建议不要使用箭头函数，因为它们在某些情况下可能会导致一些问题。
describe('Blog app', function() {
  describe('when logged in', function() {
    beforeEach(function() {
      const user = {
        name: 'mluukkai',
        username: 'mluukkai',
        password: 'salainen'
      }
      // 运行测试之前清空服务器的数据库
      cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
      cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user) 
      cy.visit('/',{ timeout: 10000 })
    })

    // it('Login form is shown', function() {
    //   cy.visit('')
    //   cy.contains('username')
    //   cy.contains('password')
    //   cy.contains('Login')
    // })
    // describe('Login',function() {
    //   it('succeeds with correct credentials', function() {
    //     cy.get('#username').type('mluukkai')
    //     cy.get('#password').type('salainen')
    //     cy.get('#login-button').click()
    //     cy.contains(`mluukkai logged-in`)
    //   })
  
    //   it('fails with Wrong credentials', function() {
    //     cy.get('#username').type('errorname')
    //     cy.get('#password').type('errorpw')
    //     cy.get('#login-button').click()
    //     cy.contains('Wrong credentials')
    //     cy.get('.error').contains('Wrong credentials')
    //     // 我们可以确保错误消息是红色的并且有边框：
    //     // Cypress 要求颜色以 RGB 形式给出。
    //     cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    //     cy.get('.error').should('have.css', 'border-style', 'solid')
    //   })
    // })

    describe('When logged in', function() {
      beforeEach(function() {
        cy.login({ username: 'mluukkai', password: 'salainen' })
        cy.createBlog({ title: 'first blog', url: '132.com', author:'mluukkai', likes: 90 }).then(() => {
          cy.log('First blog created');
        });
        cy.createBlog({ title: 'second blog', url: '132.com', author:'mluukkai', likes: 10 })
        cy.createBlog({ title: 'Test Blog', url: 'test.com', author: 'Test Author', likes: 7 });
      })
  
      // it('A blog can be created', function() {
      //   cy.contains('first blog')
      //   cy.contains('view').click()
      //   cy.contains('URL: 132.com')
      //   cy.contains('like').click()
      //   cy.contains('Likes: 1')
  
      // })
      it('A blog can be liked', function() {
        cy.contains('second blog').parent().find('button').click()
        cy.contains('second blog').parent().find('button').should('contain', 'hide')
        // cy.contains('view').click()
        // cy.contains('like').click()
        // cy.contains('Likes: 1')
        cy.contains('URL: 132.com')
        // 找到包含第二个博客条目的元素
        cy.get('.blog-item')
        .eq(1) // 选择第二个博客条目
        .within(() => {
          // 找到并点击 "like" 按钮
          // cy.get('button:contains("like")').click();
          // 连续点击 "like" 按钮 3 次
          cy.wrap(Array(3).fill(null)).each(() => {
            cy.get('button:contains("like")').click();  
          });
          cy.contains('Likes: 13');
        });
      })
      // 21 测试以确保创建博客的用户可以删除它。
      it('User can delete their blog', () => {
        // 确保创建的博客存在
        cy.contains('Test Blog');
        // 点击删除按钮
        cy.get('.blog-item')
        .eq(2).within(() => {
          cy.contains('remove').click();
        });
        // 确认博客已被删除
        cy.contains('Test Blog').should('not.exist');
      });
      // 22  进行测试以确保只有创建者才能看到博客的删除按钮，其他任何人都看不到。
      it('A blog can be deleted', function() {
        // 模拟博客创建者登录并创建博客
        cy.login({ username: 'mluukkai', password: 'salainen' });
        cy.createBlog({ title: 'Test Blog-mluukkai', url: 'test.com', author: 'Test Author', likes: 0 });

        // 验证博客创建者可以看到删除按钮
        cy.get('.blog-item')
        .eq(2).within(() => {
          cy.contains('remove').click();
        });

        // 模拟其他用户登录
        cy.createUser({ username: 'kxzb', name: 'kxzb', password: '123456' })
        cy.login({ username: 'kxzb', password: '123456' });
        cy.contains(`kxzb logged-in`)
        
        // TODO why this not success？
        // cy.get('.blog-item')
        // .eq(2).within(() => {
        //   cy.contains('remove').should('not.exist');
        // });
        // this ok
        cy.get('button:contains("remove")').should('not.exist');
        cy.createBlog({ title: 'balala-xiaomoxian', url: 'test.com', author: 'Test Author', likes: 8 });
        cy.contains('balala-xiaomoxian')
        cy.contains('Likes: 8')
        
      })
      // 23 进行一个测试，检查博客是否按喜欢排序，最喜欢的博客排在第一位。
      it('A blog is sort by likes', function() {

        cy.get('.blog-item')
        .eq(0) 
        .within(() => {
          cy.contains('Likes: 90');
        });
  
        cy.get('.blog-item')
        .eq(1) 
        .within(() => {
          cy.contains('Likes: 10'); 
        });

        cy.get('.blog-item')
        .eq(2)
        .within(() => {
          cy.contains('Likes: 7');
          cy.contains('Test Blog').parent().find('button').click()

          cy.wrap(Array(10).fill(null)).each(() => {
            cy.get('button:contains("like")').click(); 
            // NB
            cy.wait(500); // 在每次点击之后等待1秒钟 
          });
        });

        cy.getAllBlogs().then(()=>{
          cy.get('.blog-item')
          .eq(1) 
          .within(() => {
            cy.contains('Likes: 17'); 
          });
        })
      })
    })
  })
})