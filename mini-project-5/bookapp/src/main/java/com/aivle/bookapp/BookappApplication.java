package com.aivle.bookapp;

import com.aivle.bookapp.domain.Book;
import com.aivle.bookapp.domain.Comment;
import com.aivle.bookapp.domain.User;
import com.aivle.bookapp.repository.BookRepository;
import com.aivle.bookapp.repository.CommentRepository;
import com.aivle.bookapp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableJpaAuditing
public class BookappApplication {

	@Bean
	CommandLineRunner init(BookRepository bookRepository, UserRepository userRepository, CommentRepository commentRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			User u1 = new User();
			u1.setLoginId("aaa");
			u1.setName("aaa");
			u1.setPassword(passwordEncoder.encode("aaaa"));
			userRepository.save(u1);

			User u2 = new User();
			u2.setLoginId("test");
			u2.setName("test");
			u2.setPassword(passwordEncoder.encode("1234"));
			userRepository.save(u2);

			User u3 = new User();
			u3.setLoginId("qwer");
			u3.setName("쀼티곤듀");
			u3.setPassword(passwordEncoder.encode("1234"));
			userRepository.save(u3);

			// save, findById 예제 코드
			/*Book book = new Book();
			book.setTitle("Spring boot 입문");
			book.setAuthor("임한울");

			Book saved = bookRepository.save(book);

			System.out.println("책 id: " + saved.getId());

			Book book2 = bookRepository.findById(1L).orElseThrow(() -> new RuntimeException("책이 없음"));

			System.out.println("-------------------");
			System.out.println("book2의 id: " + book2.getId());
			System.out.println("book2의 title: " + book2.getTitle());
			System.out.println("book2의 author: " + book2.getAuthor());*/

			Book b1 = new Book();
			b1.setTitle("코믹 메이플 스토리 S 수학도둑 3 - 어둠의 길로 가는 문");
			b1.setAuthor("송도수, 여운방 (지은이), 서정 엔터테인먼트 (그림)");
			b1.setContent("2006년 첫 출간되어 2024년 100권으로 완결 후 누적 판매 900만 부를 기록한 &lt;수학도둑&gt;의 새로운 시작이다. ‘초능력’과 미스터리한 세계를 배경으로 한 모험 이야기와 초등 수학, 과학 콘텐츠를 함께 담았다.");
			b1.setCoverImageUrl("http://localhost:8080/uploads/covers/888ed6ee-94cc-424c-9b92-4251d615d0cb.png");
			b1.setGenre("실용서적");
			b1.setStyle("미니멀");
			b1.setUserId(1L);
			b1.setTags("수학,과학,코믹,어린이");
			bookRepository.save(b1);

			Book b2 = new Book();
			b2.setTitle("코믹 메이플 스토리 S 수학도둑 3 - 어둠의 길로 가는 문");
			b2.setAuthor("송도수, 여운방 (지은이), 서정 엔터테인먼트 (그림)");
			b2.setContent("2006년 첫 출간되어 2024년 100권으로 완결 후 누적 판매 900만 부를 기록한 &lt;수학도둑&gt;의 새로운 시작이다. ‘초능력’과 미스터리한 세계를 배경으로 한 모험 이야기와 초등 수학, 과학 콘텐츠를 함께 담았다.");
			b2.setCoverImageUrl("http://localhost:8080/uploads/covers/ffc2503d-a30d-4da3-aa4d-501d632fb179.png");
			b2.setGenre("실용서적");
			b2.setStyle("미니멀");
			b2.setUserId(1L);
			b2.setTags("수학,과학,코믹,어린이");
			bookRepository.save(b2);

			Book b3 = new Book();
			b3.setTitle("코믹 메이플 스토리 오프라인 RPG 46");
			b3.setAuthor("송도수 (글), 서정은 (그림)");
			b3.setContent("2004년 4월에 1권을 출간하여 지금까지, ‘8년 연속 초특급 베스트셀러’,  ‘1200만부 돌파’를 기록하며 독자들의 꾸준한 사랑을 받고 있는 아동 만화책이다. 각양각색 개성만점의 주인공들과 함께 모험을 떠나며 우정, 도전, 배려, 정의를 배우고 독창적인 이야기를 통해 마음껏 상상해보고 추론하는 과정에서는 어린이들의 상상력과 창의력이 향상된다.");
			b3.setCoverImageUrl("http://localhost:8080/uploads/covers/fb58aff0-9eff-4c1f-b520-591e4afaee99.png");
			b3.setGenre("소설");
			b3.setStyle("미니멀");
			b3.setUserId(3L);
			b3.setTags("모험,우정,코믹,어린이");
			bookRepository.save(b3);

			Book b4 = new Book();
			b4.setTitle("나의 사랑아");
			b4.setAuthor("강패");
			b4.setContent("오랜 시간 견뎌온 참고마운 사람 잘해주지 못 해 미안해 나의 사랑아 나의 사랑아.");
			b4.setCoverImageUrl("http://localhost:8080/uploads/covers/a39b4528-2b9b-4eaf-9126-eb697bbf56c8.png");
			b4.setGenre("인문학");
			b4.setStyle("Photorealistic, real human photography style, highly detailed portrait, 8k resolution");
			b4.setUserId(2L);
			b4.setTags("사랑,시,감성");
			bookRepository.save(b4);

			Book b5 = new Book();
			b5.setTitle("멀티미디어 헐크버스터");
			b5.setAuthor("밀키밀리");
			b5.setContent("영웅이 없이 선택해도 좋다.\n임영웅이 되어 버리고 말 것이다.\n");
			b5.setCoverImageUrl("http://localhost:8080/uploads/covers/614dd0a5-a8f8-4fe4-8a4b-f7f0c801c8e9.png");
			b5.setGenre("실용서적");
			b5.setStyle("미니멀");
			b5.setUserId(3L);
			b5.setTags("유머,음악,패러디");
			bookRepository.save(b5);

			Book b6 = new Book();
			b6.setTitle("엇박자의 서점");
			b6.setAuthor("제미니");
			b6.setContent("\"저기, 혹시 '여름의 끝'이라는 책 재고가 아직 있을까요?\"\n\n은우는 모니터 화면에서 시선을 떼고 눈앞의 여자를 바라보았다. 헝클어진 머리에 빗방울이 몇 방울 맺혀 있는 그녀는 숨을 헐떡이고 있었다. 매장 컴퓨터를 두드려보던 은우가 미안한 표정으로 고개를 저었다.\n\n\"죄송합니다. 그 책이 워낙 소량 입고된 독립출판물이라, 방금 마지막 권이 팔렸네요.\"\n\n\"아… 그렇구나. 감사합니다.\"\n\n여자의 얼굴에 깊은 실망감이 스쳤다. 힘없이 돌아서는 그녀의 뒷모습을 보며 은우는 묘한 잔상을 느꼈다. 그게 두 사람의 첫 번째 '엇박자'였다.\n\n일주일 뒤, 폭우가 쏟아지던 목요일 저녁이었다. 대형 서점의 한적한 코너를 정리하던 은우는 구석 바닥에 주저앉아 책을 읽고 있는 한 여자를 발견했다. 지난주에 그 책을 찾던 그 여자였다. 이번에는 다행히 재입고된 책을 찾았는지, '여름의 끝'을 소중하게 두 손으로 쥐고 있었다.\n\n\"저기, 바닥이 차가운데 여기 앉아서 보시겠어요?\"\n\n은우가 접이식 의자를 건네자, 여자는 깜짝 놀라며 고개를 들었다. 동그란 눈이 은우의 사원증과 얼굴을 번갈아 보더니 이내 맑게 웃었다.\n\n\"아, 지난번에 그 책 없다고 하셨던 분 맞죠? 저 드디어 구했어요!\"\n\n\"축하드려요. 정말 구하기 힘든 책인데.\"\n\n\"이 책 작가님이 저랑 감성이 너무 비슷해서 꼭 소장하고 싶었거든요. 아, 제 이름은 민아예요. 서민아.\"\n\n그날 이후, 민아는 서점의 단골이 되었다. 은우가 추천하는 책은 늘 민아의 마음에 쏙 들었고, 민아가 들려주는 책 평론은 은우의 잔잔했던 일상에 신선한 자극이 되었다. 은우는 서점 문이 열릴 때마다 자연스럽게 민아를 찾기 시작했다. 주위의 소음은 지워지고 오직 서로의 목소리만 선명해지는 시간, 두 사람 사이에는 활자보다 따뜻한 감정이 피어나고 있었다.\n\n어느덧 계절이 바뀌어 낙엽이 떨어지는 가을이 왔다. 은우는 더 이상 민아를 '서점 손님'으로만 남겨두고 싶지 않았다. 몇 날 며칠을 고민한 끝에, 은우는 서점 근처의 조용한 카페 예약을 잡고 고백을 결심했다.\n\n\"민아 씨, 이번 주 토요일 저녁에 서점 마감하고 같이 저녁 먹을래요? 할 말이 있어요.\"\n\n민아의 얼굴이 살짝 붉어졌다. 그녀 역시 은우와 같은 마음인 듯, 수줍게 고개를 끄덕였다.\n\n\"좋아요. 기다릴게요.\"\n\n하지만 운명은 꼭 중요한 순간에 짓궂은 장난을 치곤 한다. 토요일 당일, 서점 마감을 불과 한 시간 앞두고 매장 시스템에 대규모 오류가 발생했다. 결제는 물론 재고 확인까지 먹통이 되었고, 전 직원이 매달려 이를 해결해야 했다. 핸드폰은 사물함 안에 있었기에 민아에게 연락할 방법조차 없었다.\n\n약속 시간에서 한 시간이 꼬박 지난 후에야 은우는 코트를 챙겨 들고 카페로 미친 듯이 달렸다. 숨이 턱 끝까지 차올라 문을 열었을 때, 민아가 앉아있던 자리에는 식어버린 찻잔만 덩그러니 놓여 있었다.\n\n'늦었구나.'\n\n허탈감과 미안함에 은우는 자리에 주저앉았다. 늘 한 걸음씩 늦는 자신의 타이밍이 원망스러웠다.\n\n다음 날 일요일, 서점은 여느 때처럼 활기찼지만 은우의 마음은 가라앉아 있었다. 민아에게 장문의 사과 메시지를 보냈지만 아직 읽지 않음 표시가 사라지지 않고 있었다.\n\n멍하니 신간 도서를 진열하던 은우의 눈에, 익숙한 책 한 권이 들어왔다. 민아가 그토록 좋아했던 책, '여름의 끝'이었다. 그런데 매대에 놓인 책들 사이에 낯선 종이 한 장이 삐져나와 있었다.\n\n은우는 홀린 듯 그 종이를 빼내어 펼쳤다. 민아의 아기자기한 글씨체였다.\n\n『언제나 우리의 타이밍은 조금씩 어긋나곤 했죠. 처음 서점에서 만났을 때도, 어제 카페에서도요.\n하지만 책의 마지막 장을 덮을 때 알게 되었어요. 어떤 이야기는 주인공들이 먼 길을 돌아가기 때문에 더 아름답다는 걸요.\n저 아직 안 떠났어요. 지금 서점 옥상 정원에 있어요. 이번엔 은우 씨가 늦지 않게 와줄래요?』\n\n은우의 심장이 터질 듯이 뛰기 시작했다. 그는 들고 있던 책들을 내려놓고 비상구 계단을 향해 달렸다. 계단을 두 칸씩 뛰어올라 마침내 옥상 문을 거칠게 열었을 때, 가을 햇살을 받으며 서 있는 민아가 보였다.\n\n민아가 뒤를 돌아보며 환하게 웃었다.\n\n\"이번엔 생각보다 빨리 왔네요?\"\n\n은우가 거친 숨을 고르며 민아의 앞으로 걸어갔다. 더 이상 타이밍 핑계를 대며 머뭇거리고 싶지 않았다. 은우는 민아의 손을 꼭 쥐었다.\n\n\"미안해요, 오래 기다리게 해서. 그리고 고마워요, 거기 있어 줘서.\"\n\n두 사람의 어긋나던 엇박자가 마침내 하나의 아름다운 멜로디로 겹쳐지는 순간이었다.");
			b6.setCoverImageUrl("http://localhost:8080/uploads/covers/8814f569-9c30-4d0f-82fd-0cc005125afe.png");
			b6.setGenre("소설");
			b6.setStyle("일러스트");
			b6.setUserId(2L);
			b6.setTags("제미니,단편소설,로맨스,서점");
			bookRepository.save(b6);

			// 댓글 더미 데이터
			Comment c1 = new Comment();
			c1.setUserId(2L);
			c1.setBookId(1L);
			c1.setContent("어렸을 때 정말 재밌게 봤던 시리즈인데 다시 보니 더 좋네요!");
			commentRepository.save(c1);

			Comment c2 = new Comment();
			c2.setUserId(1L);
			c2.setBookId(1L);
			c2.setContent("수학 개념을 만화로 풀어줘서 아이가 좋아해요.");
			commentRepository.save(c2);

			Comment c3 = new Comment();
			c3.setUserId(1L);
			c3.setBookId(3L);
			c3.setContent("우정, 모험 이야기가 인상 깊었어요. 강력 추천합니다.");
			commentRepository.save(c3);

			Comment c4 = new Comment();
			c4.setUserId(3L);
			c4.setBookId(4L);
			c4.setContent("짧지만 마음에 와닿는 글이네요.");
			commentRepository.save(c4);

			Comment c5 = new Comment();
			c5.setUserId(1L);
			c5.setBookId(6L);
			c5.setContent("엇박자의 서점 정주행했어요. 결말이 너무 감동적이에요!");
			commentRepository.save(c5);

			Comment c6 = new Comment();
			c6.setUserId(2L);
			c6.setBookId(6L);
			c6.setContent("서점이라는 아늑한 배경과 '타이밍'이라는 설레는 소재가 만나 한 편의 단편 영화를 본 듯한 기분이에요.\n" +
					"\n" +
					"특히 약속이 어긋난 순간 등장한 민아의 편지 속 *\"어떤 이야기는 주인공들이 먼 길을 돌아가기 때문에 더 아름답다는 걸요\"*라는 문장이 마음에 깊이 와닿았습니다. 어긋나던 두 사람의 엇박자가 서로를 향한 기다림과 용기로 마침내 아름다운 선율이 되는 완벽한 엔딩이었어요. 여운이 길게 남는 참 예쁜 이야기, 잘 읽었습니다!");
			commentRepository.save(c6);

			Comment c7 = new Comment();
			c7.setUserId(1L);
			c7.setBookId(1L);
			c7.setContent("어릴 때 도서관에서 시리즈를 빌려보던 기억이 새록새록 나네요.\n" +
					"\n" +
					"수학도둑 특유의 미스터리한 분위기와 초능력 설정이 어우러져서, 아이들뿐만 아니라 어른이 봐도 충분히 재밌는 작품인 것 같아요. 이번 권에서는 '어둠의 길로 가는 문'이라는 부제처럼 새로운 떡밥이 잔뜩 깔려서 다음 권이 더 기대됩니다.");
			commentRepository.save(c7);

			Comment c8 = new Comment();
			c8.setUserId(3L);
			c8.setBookId(2L);
			c8.setContent("표지만 보고 그냥 넘기려다가 줄거리 보고 바로 구매했어요.\n" +
					"\n" +
					"초등 수학, 과학 개념을 스토리 안에 자연스럽게 녹여낸 점이 정말 좋았습니다. 아이가 어려워하던 단원이었는데 이 책을 보고 나서 흥미를 갖기 시작했어요. 시리즈 완결까지 쭉 봐야겠네요.");
			commentRepository.save(c8);

			Comment c9 = new Comment();
			c9.setUserId(2L);
			c9.setBookId(3L);
			c9.setContent("아이와 함께 읽기 딱 좋은 만화책이에요.\n" +
					"\n" +
					"개성 강한 캐릭터들이 각자의 매력을 뽐내면서도 우정과 협동을 보여주는 장면들이 많아서, 보는 내내 흐뭇했습니다. 8년 연속 베스트셀러라는 타이틀이 그냥 나온 게 아니었네요. 다음 권도 바로 주문했습니다!");
			commentRepository.save(c9);

			Comment c10 = new Comment();
			c10.setUserId(1L);
			c10.setBookId(4L);
			c10.setContent("짧은 글인데도 여운이 굉장히 길게 남아요.\n" +
					"\n" +
					"한 문장 한 문장이 누군가를 향한 애틋한 마음을 그대로 담고 있는 것 같아서, 읽고 나서 한참 동안 멍하니 있었습니다. 표지 이미지도 글의 분위기와 정말 잘 어울리네요.");
			commentRepository.save(c10);

			Comment c11 = new Comment();
			c11.setUserId(3L);
			c11.setBookId(5L);
			c11.setContent("제목부터 심상치 않더니 내용은 더 심상치 않네요.\n" +
					"\n" +
					"읽다가 갑자기 '임영웅'이 등장하는 부분에서 빵 터졌습니다. 진지하게 읽어야 할지 웃어야 할지 고민하게 만드는 묘한 매력이 있는 작품이에요. 짧은 분량이라 가볍게 읽기 좋습니다.");
			commentRepository.save(c11);

			Comment c12 = new Comment();
			c12.setUserId(2L);
			c12.setBookId(6L);
			c12.setContent("은우와 민아의 첫 만남부터 옥상 정원에서의 재회까지, 장면 하나하나가 머릿속에 그림처럼 그려졌어요.\n" +
					"\n" +
					"두 사람이 자꾸 엇갈리기만 해서 안타까웠는데, 민아가 남긴 편지 덕분에 결국 다시 만나게 되는 전개가 너무 따뜻했습니다. 일러스트 표지도 분위기를 잘 살려줘서 더 몰입해서 읽을 수 있었어요. 다음 작품도 기대하겠습니다!");
			commentRepository.save(c12);
		};
	}

	public static void main(String[] args) {
		SpringApplication.run(BookappApplication.class, args);
	}
}
