/*
 * Axelor Business Solutions
 *
 * Copyright (C) 2022 Axelor (<http://axelor.com>).
 *
 * This program is free software: you can redistribute it and/or  modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package com.axelor.studio.bpm.service.log;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.OutputStreamAppender;
import com.axelor.studio.db.WkfInstance;
import com.axelor.studio.db.repo.WkfInstanceRepository;
import com.axelor.studio.service.AppSettingsStudioService;
import com.google.inject.Inject;
import com.google.inject.persist.Transactional;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class WkfLogServiceImpl implements WkfLogService {

  protected WkfLoggerInitServiceImpl wkfLoggerInitServiceImpl;

  protected WkfInstanceRepository wkfInstanceRepository;

  protected AppSettingsStudioService appSettingsService;

  @Inject
  public WkfLogServiceImpl(
      WkfLoggerInitServiceImpl wkfLoggerInitServiceImpl,
      WkfInstanceRepository wkfInstanceRepository,
      AppSettingsStudioService appSettingsService) {
    this.wkfLoggerInitServiceImpl = wkfLoggerInitServiceImpl;
    this.wkfInstanceRepository = wkfInstanceRepository;
    this.appSettingsService = appSettingsService;
  }

  @Override
  public OutputStreamAppender<ILoggingEvent> createOrAttachAppender(String processInstnaceId) {

    OutputStreamAppender<ILoggingEvent> appender =
        wkfLoggerInitServiceImpl.getAppender(processInstnaceId);
    if (appender != null) {
      wkfLoggerInitServiceImpl.attachAppender(appender);
    } else {
      appender = new OutputStreamAppender<ILoggingEvent>();
      appender.setContext(wkfLoggerInitServiceImpl.getLoggerContext());
      ByteArrayOutputStream logStream = new ByteArrayOutputStream();
      appender.setOutputStream(logStream);
      appender.setName(processInstnaceId);
      appender.setEncoder(wkfLoggerInitServiceImpl.getEncoder());
      appender.start();
      wkfLoggerInitServiceImpl.attachAppender(appender);
      wkfLoggerInitServiceImpl.addAppender(processInstnaceId, appender);
    }

    return appender;
  }

  @Override
  public void writeLog(String processInstanceId) {
    OutputStreamAppender<ILoggingEvent> appender =
        wkfLoggerInitServiceImpl.getAppender(processInstanceId);
    Boolean isLog = appSettingsService.isAddBpmLog();
    if (appender == null || !isLog) {
      return;
    }

    try {
      ByteArrayOutputStream outStream = (ByteArrayOutputStream) appender.getOutputStream();
      if (outStream.size() > 0) {
        updateProcessInstanceLog(processInstanceId, outStream);
      }
      outStream.close();
    } catch (IOException e) {
    }
    appender.setOutputStream(new ByteArrayOutputStream());
    wkfLoggerInitServiceImpl.detachAppender(appender);
  }

  @Transactional
  protected void updateProcessInstanceLog(
      String processInstanceId, ByteArrayOutputStream outStream) {
    WkfInstance wkfInstance = wkfInstanceRepository.findByInstanceId(processInstanceId);

    if (wkfInstance != null) {
      String logText = wkfInstance.getLogText();
      if (logText == null) {
        logText = "";
      }
      StringBuilder logTextBuilder = new StringBuilder(logText);
      logTextBuilder.append(new String(outStream.toByteArray()));
      wkfInstance.setLogText(logTextBuilder.toString());
      wkfInstanceRepository.save(wkfInstance);
    }
  }

  @Transactional
  public void clearLog(String processInstanceId) {
    WkfInstance wkfInstance = wkfInstanceRepository.findByInstanceId(processInstanceId);

    if (wkfInstance != null) {
      wkfInstance.setLogText(null);
      wkfLoggerInitServiceImpl.remove(processInstanceId);
      wkfInstanceRepository.save(wkfInstance);
    }
  }
}
