Cách đặt tên:
- Store Procedure: nếu làm cho portal thì mình sẽ đặt prefix là AdminWeb, còn làm cho Web thì sẽ đăt la Web
- Tên store thường đặt theo nghiệp vụ và theo tên Bảng: ví dụ làm về account thì sẽ như này: CRM_ACCOUNT_CreateOrUpdate_AdminWeb ,......
- Source:
   + Luôn luôn checkout master về khi làm chức năng mới hoặc fix bug
   + Tạo nhánh theo cấu trúc : feature => mới, modify => Chỉnh sửa, fix => Fix bug
      Ví dụ: feature/ddMMyyyy_Tên Chức năng (tạo sao cho dễ hiểu)
   + Làm xong thì merge vào develop để build cho tester test, bên mình dùng CI/CD nên chỉ cần merge và gõ theo keyword của từng dụ án
   + Khi tạo mới store hoặc chỉnh sửa thì add vào thư mục database của api theo dự án 

 * Commit trong dự án join commit theo dạng sau luôn nhé: - action[@function]: activity + #id issue
- Ví dụ viết chức năng mới commit(store là chức năng làm) -> feat: store  #1
- Cập nhật hoặc update cho store -> update(@store): [hành đông] => @store #2 ở đây là chức năng cập nhật 
- Các upatee nhỏ -> chore(@store): [hành động] #3

Ngoài ra còn xài các type như: fix,refactor,hotfix,…


