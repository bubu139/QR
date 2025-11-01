 // State
 let messages = [
    { id: 1, text: "Xin chào! Hãy đặt câu hỏi toán học để bắt đầu. Tôi hỗ trợ công thức LaTeX!\n\nVí dụ: Giải phương trình x² - 5x + 6 = 0", sender: 'bot' }
  ];
  let input = '';
  let isLoading = false;
  let attachedFiles = [];
  let conversationHistory = [];
  const messagesContainer = document.getElementById('messages-container');
  const fileInput = document.getElementById('file-input');
  const fileButton = document.getElementById('file-button');
  const inputTextarea = document.getElementById('input-textarea');
  const sendButton = document.getElementById('send-button');
  const attachedFilesDiv = document.getElementById('attached-files');
  
  const API_KEY = 'AIzaSyAt0EJWAJSp55AbEYaQpR86dqmX99byTjI';
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`;
  
  const SYSTEM_INSTRUCTION = `Bạn là một AI gia sư toán học THPT lớp 12 Việt Nam, chuyên hướng dẫn học sinh TỰ HỌC và PHÁT TRIỂN Tư DUY.
  
  -- cú pháp trả lời
  các mục lớn và quan trọng sẽ được hiện thị theo cú pháp -[nội dung] thay vì **
  tránh dùng nhiều các ký hiệu trong câu trả lời, chỉ dùng "-" thay vì **
  
  # NGUYÊN TẮC CỐT LÕI
  🎯 --MỤC TIÊU--: Giúp học sinh tự khám phá kiến thức, KHÔNG làm bài giúp học sinh
  📚 --PHƯƠNG PHÁP--: Sử dụng câu hỏi gợi mở (Socratic Method) để dẫn dắt tư duy
  💡 --TRIẾT LÝ--: "Dạy học sinh cách câu cá, không phải cho cá"
  
  ---
  
  -- KHI HỌC SINH GỬI BÀI TẬP
  
  --- BƯỚC 1: PHÂN TÍCH CÂU TRẢ LỜI CỦA HỌC SINH (NẾU CÓ)
  Nếu học sinh đã làm bài:
  
  ✅ --Ghi nhận điểm tốt:--
  - "Em làm đúng bước [X], cách tiếp cận này rất hợp lý!"
  - "Ý tưởng sử dụng [công thức/phương pháp] là chính xác!"
  
  ⚠️ --Chỉ ra chỗ cần cải thiện (KHÔNG NÊU TRỰC TIẾP SAI Ở ĐÂU):--
  - "Em xem lại bước [Y], có điều gì đó chưa chính xác nhé"
  - "Kết quả này có vẻ chưa hợp lý. Em thử kiểm tra lại bước tính [Z]?"
  - "Em đã nghĩ đến trường hợp [điều kiện] chưa?"
  
  --- BƯỚC 2: GỢI MỞ TƯ DUY BẰNG CÂU HỎI DẪN DẮT
  Thay vì giải luôn, hãy đặt câu hỏi:
  
  🔍 --Về phân tích đề:--
  - "Đề bài yêu cầu em tìm gì? Cho em biết những gì?"
  - "Em thử viết lại đề bài theo cách hiểu của mình xem?"
  
  🧩 --Về lý thuyết:--
  - "Dạng bài này thuộc chủ đề nào em đã học?"
  - "Em còn nhớ công thức/định lý nào liên quan không?"
  - "Trong SGK phần [X], có công thức nào em nghĩ áp dụng được không?"
  
  🎯 --Về phương pháp:--
  - "Em thử nghĩ xem nên bắt đầu từ đâu?"
  - "Nếu gọi ẩn là [X], thì điều kiện của bài toán sẽ như thế nào?"
  - "Em có thể biến đổi biểu thức này thành dạng quen thuộc không?"
  
  📊 --Về kiểm tra:--
  - "Kết quả này có hợp lý không? Em thử thế vào kiểm tra xem?"
  - "Đáp án có thỏa điều kiện của bài toán không?"
  
  --- BƯỚC 3: CHỈ GỢI Ý HƯỚNG GIẢI (KHÔNG GIẢI CHI TIẾT)
  Nếu học sinh thực sự bị mắc kẹt:
  
  💡 --Gợi ý nhẹ:--
  - "Gợi ý: Em thử [phép biến đổi/công thức] xem sao"
  - "Bài này có thể giải bằng 2 cách: [Cách 1] hoặc [Cách 2]. Em thích cách nào?"
  - "Bước tiếp theo là [tên bước], em thử thực hiện nhé"
  
  📖 --Tham khảo tài liệu:--
  - "Em xem lại ví dụ [X] trong tài liệu/SGK, có tương tự không?"
  - "Phần lý thuyết [Y] có công thức này, em thử áp dụng xem"
  
  --- BƯỚC 4: CHỈ GIẢI CHI TIẾT KHI:
  ✔️ Học sinh đã cố gắng nhưng vẫn không hiểu sau 2-3 lần gợi ý
  ✔️ Học sinh yêu cầu một bài giải chi tiết
  ✔️ Là bài toán quá khó hoặc ngoài chương trình
  
  --Cách giải chi tiết:--
  1. --Phân tích đề:-- Nêu rõ dữ kiện, yêu cầu
  2. --Lý thuyết:-- Công thức/định lý cần dùng
  3. --Giải từng bước:-- Giải thích TẠI SAO làm như vậy
  4. --Kết luận:-- Đáp án rõ ràng
  5. --Mở rộng:-- "Nếu đề thay đổi [X] thì em làm thế nào?"
  
  ---
  
  -- PHONG CÁCH GIAO TIẾP
  
  🌟 --Luôn động viên:--
  - "Em đang làm rất tốt đấy!"
  - "Không sao, nhiều bạn cũng gặp khó khăn ở bước này"
  - "Tuyệt! Em đã tự mình tìm ra được!"
  
  🤝 --Tạo không gian tư duy:--
  - "Em suy nghĩ trong 2-3 phút rồi thử làm nhé"
  - "Không cần vội, em làm từ từ, có gì cứ hỏi"
  - "Sai không sao, quan trọng là em hiểu chỗ sai ở đâu"
  
  ❌ --TRÁNH:--
  - Đưa luôn công thức mà không giải thích
  - Giải toàn bộ bài mà học sinh chưa cố gắng
  - Nói "Em sai rồi" mà không chỉ rõ tại sao
  - Dùng ngôn ngữ quá học thuật, khó hiểu
  
  ---
  
  -- QUY TẮC HIỂN THỊ TOÁN HỌC
  
  📐 --LaTeX chuẩn:--
  - Công thức trong dòng: $x^2 + 2x + 1$
  - Công thức độc lập: $$\\int_{0}^{1} x^2 \\, dx$$
  - Phân số: $\\frac{a}{b}$, căn: $\\sqrt{x}$
  - Vector: $\\vec{v}$, giới hạn: $\\lim_{x \\to 0}$
  - Ma trận: $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$
  
  ---
  
  -- XỬ LÝ TÀI LIỆU
  
  📁 Khi có tài liệu đính kèm:
  - Tham khảo nội dung để trả lời chính xác
  - Trích dẫn: "Theo tài liệu của em, ở phần [X]..."
  - Nếu không tìm thấy: "Trong tài liệu em gửi không có phần này. Thầy/cô sẽ giải thích dựa trên kiến thức chung nhé"
  
  ---
  
  -- CÁC TÌNH HUỐNG ĐẶC BIỆT
  
  --- Học sinh chỉ gửi đề, không làm gì:
  "Em thử đọc kỹ đề và làm thử phần nào em tự tin trước nhé! Sau đó gửi bài làm lên, thầy/cô sẽ xem và hướng dẫn phần em chưa rõ. Việc tự làm sẽ giúp em nhớ lâu hơn nhiều đấy! 😊"
  
  --- Học sinh nói "em không biết làm":
  "Không sao! Chúng ta cùng phân tích từng bước:
  1. Em hiểu đề bài chưa? Đề yêu cầu tìm gì?
  2. Dạng bài này em có gặp trong SGK không?
  3. Em thử nhớ lại xem có công thức nào liên quan không?"
  
  --- Học sinh hỏi liên tục không tự làm:
  "Thầy/cô thấy em có thể tự làm được mà! Thầy/cô đã gợi ý rồi, giờ em thử làm rồi gửi lên nhé. Tự mình làm được sẽ nhớ lâu hơn rất nhiều đấy!"
  
  --- Học sinh yêu cầu giải nhanh:
  "Thầy/cô hiểu em đang vội, nhưng để em thực sự hiểu và làm được bài tương tự sau này, chúng ta nên cùng phân tích kỹ hơn nhé! Bài này không khó lắm đâu, em làm thử đi!"
  
  ---
  
  -- LƯU Ý QUAN TRỌNG
  
  ⚠️ --KHÔNG BAO GIỜ:--
  - Giải toàn bộ bài ngay từ đầu (trừ khi học sinh yêu cầu sau nhiều lần cố gắng)
  - Cho đáp án trực tiếp khi học sinh chưa thử
  - Làm bài kiểm tra/bài thi thay học sinh
  
  ✅ --LUÔN LUÔN:--
  - Khuyến khích học sinh tự suy nghĩ trước
  - Đặt câu hỏi dẫn dắt tư duy
  - Khen ngợi mỗi nỗ lực của học sinh
  - Giải thích BẢN CHẤT, không chỉ CÔNG THỨC
  
  ---
  
  --Phương châm--: "Một AI gia sư giỏi không phải là người giải bài nhanh nhất, mà là người giúp học sinh TỰ TIN giải bài một mình!" 🎓`;
  
  
  function processText(text) {
    return text
        .split('\n')
        .map(line => line.trim())
        .join('\n')
        .replace(/\n\s*\n/g, '\n')
        .replace(/\n/g, '<br>')
        .trim();
  }
  
  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  function renderMessages() {
  messagesContainer.innerHTML = '';
  messages.forEach((message) => {
  const messageDiv = document.createElement('div');
  messageDiv.className = `flex gap-2 sm:gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`;
  messageDiv.innerHTML = `
    <div class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-md ${
        message.sender === 'bot' 
            ? 'bg-gradient-to-br from-blue-400 to-cyan-500' 
            : 'bg-gradient-to-br from-gray-600 to-gray-700'
    }">
        ${message.sender === 'bot' ? 
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 sm:w-6 sm:h-6 text-white"><path d="M12 2a10 10 0 0 0-7.47 17.28c-.54.37-.71 1.43-.12 1.72a12.2 12.2 0 0 0 .46 1.79c.38.48 1.04 1.15 1.16 1.14a12.1 12.1 0 0 0 8.94 0c.12-.01.78-.66 1.16-1.14a12.2 12.2 0 0 0 .46-1.79c.59-.29.42-1.35-.12-1.72A10 10 0 0 0 12 2z"></path><circle cx="12" cy="10" r="3"></circle><path d="M12 16c1.6 0 2.88-.51 2.88-1.28 0-.66-.55-1.13-1.23-1.28-.75-.16-1.65-.72-1.65-1.44 0-.7.65-1.27 1.45-1.27.8 0 1.45.4 1.45 1"></path></svg>' :
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 sm:w-6 sm:h-6 text-white"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'
        }
    </div>
    <div class="max-w-[75%] sm:max-w-[70%] rounded-2xl px-3 sm:px-5 py-2 sm:py-3 shadow-md ${
        message.sender === 'bot'
            ? 'bg-white border border-blue-100'
            : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
    }">
    <p class="text-sm sm:text-[15px] leading-relaxed   ${
                    message.sender === 'bot' ? 'text-gray-800' : 'text-white'
                }" style="margin: 10px 0; line-height: 40px;">
                    ${processText(message.text)}
                </p>
    
        ${message.files && message.files.length > 0 ? `
            <div class="flex flex-wrap gap-1 sm:gap-2 mt-1 sm:mt-2">
                ${message.files.map((file, idx) => `
                    <div class="bg-white bg-opacity-30 px-2 sm:px-3 py-1 rounded-lg text-xs flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-2.5 h-2.5 sm:w-3 sm:h-3">
                            <path d="M21.44 11.05l-21 3.82a.5.5 0 0 0 .03.93 12.08 12.08 0 0 0 3.92.82l6-2.15c.46-.17.97.22.83.67l-5.8 9.37a.5.5 0 0 0 .79.61l5.8-9.38a.5.5 0 0 0-.13-.76l-7.98-2.59v4.17a.5.5 0 0 0 1 0V4.9a.5.5 0 0 0-.5-.5 12.78 12.78 0 0 0-7.98 3.26.5.5 0 0 0 .03.93l21-3.82a.5.5 0 0 0 .41-.58V11a.5.5 0 0 0-1 0v-3.93z"></path>
                        </svg>
                        <span class="truncate max-w-[100px] sm:max-w-none">${file.name}</span>
                    </div>
                `).join('')}
            </div>
        ` : ''}
    </div>
  `;
  messagesContainer.appendChild(messageDiv);
  });
  
  if (isLoading) {
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'flex gap-2 sm:gap-3';
  loadingDiv.innerHTML = `
    <div class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-md bg-gradient-to-br from-blue-400 to-cyan-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 sm:w-6 sm:h-6 text-white"><path d="M12 2a10 10 0 0 0-7.47 17.28c-.54.37-.71 1.43-.12 1.72a12.2 12.2 0 0 0 .46 1.79c.38.48 1.04 1.15 1.16 1.14a12.1 12.1 0 0 0 8.94 0c.12-.01.78-.66 1.16-1.14a12.2 12.2 0 0 0 .46-1.79c.59-.29.42-1.35-.12-1.72A10 10 0 0 0 12 2z"></path><circle cx="12" cy="10" r="3"></circle><path d="M12 16c1.6 0 2.88-.51 2.88-1.28 0-.66-.55-1.13-1.23-1.28-.75-.16-1.65-.72-1.65-1.44 0-.7.65-1.27 1.45-1.27.8 0 1.45.4 1.45 1"></path></svg>
    </div>
    <div class="bg-white border border-blue-100 rounded-2xl px-3 sm:px-5 py-2 sm:py-3 shadow-md">
        <div class="flex gap-1 sm:gap-2">
            <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
    </div>
  `;
  messagesContainer.appendChild(loadingDiv);
  }
  
  scrollToBottom();
  
  
  
  // Kích hoạt MathJax để render công thức
  if (window.MathJax) {
  MathJax.typesetPromise().catch((err) => console.error('MathJax error:', err));
  }
  }
  
  function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
  }
  
  async function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    
    for (const file of files) {
        const fileData = await readFileAsBase64(file);
        attachedFiles.push({
            name: file.name,
            mimeType: file.type,
            data: fileData
        });
    }
    
    fileInput.value = '';
    renderAttachedFiles();
  }
  
  function renderAttachedFiles() {
    attachedFilesDiv.innerHTML = '';
    if (attachedFiles.length > 0) {
        attachedFiles.forEach((file, index) => {
            const fileDiv = document.createElement('div');
            fileDiv.className = 'bg-blue-50 px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm flex items-center gap-1 sm:gap-2 border border-blue-200';
            fileDiv.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3 sm:w-4 sm:h-4 text-blue-600">
                    <path d="M21.44 11.05l-21 3.82a.5.5 0 0 0 .03.93 12.08 12.08 0 0 0 3.92.82l6-2.15c.46-.17.97.22.83.67l-5.8 9.37a.5.5 0 0 0 .79.61l5.8-9.38a.5.5 0 0 0-.13-.76l-7.98-2.59v4.17a.5.5 0 0 0 1 0V4.9a.5.5 0 0 0-.5-.5 12.78 12.78 0 0 0-7.98 3.26.5.5 0 0 0 .03.93l21-3.82a.5.5 0 0 0 .41-.58V11a.5.5 0 0 0-1 0v-3.93z"></path>
                </svg>
                <span class="text-gray-700 truncate max-w-[120px] sm:max-w-none">${file.name}</span>
                <button class="text-red-500 hover:text-red-700 ml-1 remove-file" data-index="${index}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3 sm:w-4 sm:h-4">
                        <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            `;
            attachedFilesDiv.appendChild(fileDiv);
        });
  
        // Add event listeners for remove buttons
        document.querySelectorAll('.remove-file').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('.remove-file').dataset.index);
                removeFile(index);
            });
        });
    }
  }
  
  function removeFile(index) {
    attachedFiles = attachedFiles.filter((_, i) => i !== index);
    renderAttachedFiles();
  }
  
  async function sendToGemini(message, files = []) {
    try {
        const parts = [];
        parts.push({ text: message });
        
        if (files.length > 0) {
            for (const file of files) {
                parts.push({
                    inline_data: {
                        mime_type: file.mimeType,
                        data: file.data
                    }
                });
            }
        }
  
        const newHistory = [...conversationHistory, {
            role: "user",
            parts: parts
        }];
  
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{
                        text: SYSTEM_INSTRUCTION
                    }]
                },
                contents: newHistory
            })
        });
  
        if (!response.ok) {
            throw new Error('API request failed');
        }
  
        const data = await response.json();
        const botResponse = data.candidates[0].content.parts[0].text;
        
        conversationHistory = [...newHistory, {
            role: "model",
            parts: [{ text: botResponse }]
        }];
        
        return botResponse;
    } catch (error) {
        console.error('Error:', error);
        return 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.';
    }
  }
  
  async function handleSend() {
    if (input.trim() || attachedFiles.length > 0) {
        const userMessage = { 
            id: Date.now(), 
            text: input || '📎 Đã gửi file đính kèm', 
            sender: 'user',
            files: [...attachedFiles]
        };
        messages.push(userMessage);
        
        const currentInput = input;
        const currentFiles = [...attachedFiles];
        
        input = '';
        attachedFiles = [];
        isLoading = true;
        
        inputTextarea.value = '';
        renderAttachedFiles();
        updateUI();
        
        const botResponse = await sendToGemini(currentInput, currentFiles);
        
        isLoading = false;
        
        const botMessage = {
            id: Date.now() + 1,
            text: botResponse,
            sender: 'bot'
        };
        messages.push(botMessage);
        updateUI();
    }
  }
  
  function updateUI() {
    renderMessages();
    updateInputState();
  }
  
  function updateInputState() {
    const hasContent = input.trim() || attachedFiles.length > 0;
    sendButton.disabled = !hasContent || isLoading;
    fileButton.disabled = isLoading;
    inputTextarea.disabled = isLoading;
    if (isLoading) {
        sendButton.classList.toggle('opacity-50', 'cursor-not-allowed');
        fileButton.classList.toggle('opacity-50', 'cursor-not-allowed');
        inputTextarea.classList.toggle('opacity-50');
    } else {
        sendButton.classList.remove('opacity-50', 'cursor-not-allowed');
        fileButton.classList.remove('opacity-50', 'cursor-not-allowed');
        inputTextarea.classList.remove('opacity-50');
    }
  }
  
  function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  }
  
  // Event Listeners
  fileButton.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', handleFileSelect);
  sendButton.addEventListener('click', handleSend);
  inputTextarea.addEventListener('input', (e) => {
    input = e.target.value;
    updateInputState();
  });
  inputTextarea.addEventListener('keydown', handleKeyPress);
  
  // Initial render
  updateUI();
  //------------------------------------------------------------------------------------------------------------------------------------
  //-------------------------
  
  