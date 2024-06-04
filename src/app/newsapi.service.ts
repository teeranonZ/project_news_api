import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delayWhen, map,  timer  } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { NewsApiResponse, NewsArticle } from './news-article.model';

@Injectable({
  providedIn: 'root'
})
export class NewsapiService {
  private apiKey = '0c1f2524ce8b4e239605f02f4f6991ed';
  private baseUrl = 'https://newsapi.org/v2/top-headlines?country=in&apiKey=';

  constructor(private _http: HttpClient) {}


//ฟังก์ชันนี้ใช้ในการจัดการการลองทำซ้ำเมื่อเกิดข้อผิดพลาด โดยมีการหน่วงเวลาระหว่างแต่ละครั้ง
  private retryStrategy(maxRetry: number = 3, delayMs: number = 2000) { 
    let retries = 0;
    return (errors: Observable<any>) => errors.pipe(
      delayWhen(() => timer(delayMs)),
      map(error => {
        if (++retries === maxRetry) {
          throw error;
        }
        return error;
      })
    );
  }

  // convertArticle: ฟังก์ชันนี้ใช้ในการแปลงข้อมูลบทความข่าวให้อยู่ในรูปแบบ NewsArticle
  private convertArticle(article: any): NewsArticle {
    return {
      ...article,
      publishedAt: new Date(article.publishedAt).toLocaleDateString(), // แปลงวันที่
      source: article.source.name // ดึงชื่อแหล่งที่มา
    };
  }
//ฟังก์ชันนี้ดึงข้อมูลข่าวหัวข้อหลักจาก API และแปลงข้อมูลบทความข่าวก่อนส่งออก
  getTopHeadlines(): Observable<NewsArticle[]> {
    return this._http.get<NewsApiResponse>(`${this.baseUrl}${this.apiKey}`).pipe(
      map(response => response.articles.map(this.convertArticle)), 
      
      this.retryStrategy()
    );
  }
//ฟังก์ชันนี้ดึงข้อมูลข่าวตามหมวดหมู่จาก API และแปลงข้อมูลบทความข่าวก่อนส่งออก
  getNewsByCategory(category: string): Observable<NewsArticle[]> {
    const apiUrl = `${this.baseUrl}${this.apiKey}&category=${category}`;
    return this._http.get<NewsApiResponse>(apiUrl).pipe(
      map(response => response.articles.map(this.convertArticle)), 
      
      this.retryStrategy()
    );
  }
}