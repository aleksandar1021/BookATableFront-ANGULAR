import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit {

  isVisible : boolean = false;

  ngAfterViewInit(): void {
    this.initializeCarousel();
  }

  show() : void{
    if(this.isVisible){
      this.isVisible = false
    }else{
      this.isVisible = true
    }
  }





  private initializeCarousel(): void {
    const carousel = document.querySelector(".carousel") as HTMLElement;
    const wrapper = document.querySelector(".wrapper") as HTMLElement;
    if (!carousel || !wrapper) {
      console.error("Element with class 'carousel' or 'wrapper' not found.");
      return;
    }

    const firstCard = carousel.querySelector(".card") as HTMLElement;
    const firstCardWidth = firstCard?.offsetWidth ?? 0;
    const arrowBtns = document.querySelectorAll(".wrapper i") as NodeListOf<HTMLElement>;
    const carouselChildrens = Array.from(carousel.children) as HTMLElement[];
    
    let isDragging = false;
    let isAutoPlay = true;
    let startX: number, startScrollLeft: number;
    let timeoutId: number;

    let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);
    carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
      carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
    });
    carouselChildrens.slice(0, cardPerView).forEach(card => {
      carousel.insertAdjacentHTML("beforeend", card.outerHTML);
    });

    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.offsetWidth;
    carousel.classList.remove("no-transition");

    arrowBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth;
      });
    });

    const dragStart = (e: MouseEvent) => {
      isDragging = true;
      carousel.classList.add("dragging");
      startX = e.pageX;
      startScrollLeft = carousel.scrollLeft;
    }

    const dragging = (e: MouseEvent) => {
      if (!isDragging) return;
      carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
    }

    const dragStop = () => {
      isDragging = false;
      carousel.classList.remove("dragging");
    }

    const infiniteScroll = () => {
      if (carousel.scrollLeft === 0) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        carousel.classList.remove("no-transition");
      } else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");
      }

      clearTimeout(timeoutId);
      if (!wrapper.matches(":hover")) autoPlay();
    }

    const autoPlay = () => {
      if (window.innerWidth < 800 || !isAutoPlay) return;
      timeoutId = window.setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
    }
    autoPlay();

    carousel.addEventListener("mousedown", dragStart);
    carousel.addEventListener("mousemove", dragging);
    document.addEventListener("mouseup", dragStop);
    carousel.addEventListener("scroll", infiniteScroll);
    wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
    wrapper.addEventListener("mouseleave", autoPlay);
  }
}
