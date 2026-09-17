import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppService } from './app.service.js';
import { MongooseModule } from '@nestjs/mongoose';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/fafalo'),
    MongooseModule.forFeature([

    ]),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {
}
