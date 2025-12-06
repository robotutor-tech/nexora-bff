import { Injectable } from '@nestjs/common'
import { Widget } from './types/widget'
import { apiConfig, Webclient } from '@shared'

@Injectable()
export class WidgetsService {
  private readonly widgetConfig = apiConfig.widget

  constructor(private readonly webclient: Webclient) {}

  getAllWidgets(): Promise<Widget[]> {
    return this.webclient.get<Widget[]>({ baseUrl: this.widgetConfig.baseUrl, path: this.widgetConfig.widgets })
  }
}
